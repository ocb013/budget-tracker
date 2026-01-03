/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable no-undef */

const path = require('node:path');
const fs = require('node:fs');

function getSlices(layer) {
    try {
        const dir = path.join(process.cwd(), 'src', layer);
        if (!fs.existsSync(dir)) return [];
        return fs
            .readdirSync(dir, { withFileTypes: true })
            .filter((d) => d.isDirectory())
            .map((d) => d.name)
            .sort();
    } catch {
        return [];
    }
}

module.exports = function (plop) {
    plop.setGenerator('component', {
        description: 'Create FSD UI component with SCSS + Storybook',

        prompts: [
            {
                type: 'list',
                name: 'layer',
                message: 'Layer?',
                choices: [
                    'entities',
                    'features',
                    'widgets',
                    'shared',
                    'pages'
                ]
            },

            {
                type: 'list',
                name: 'sliceChoice',
                message: 'Select slice (or create new):',
                when: (a) => a.layer !== 'shared',
                choices: (answers) => {
                    const slices = getSlices(answers.layer);
                    return ['+ Create new slice', ...slices];
                }
            },

            {
                type: 'input',
                name: 'sliceNew',
                message: 'New slice name (e.g. transaction):',
                when: (a) =>
                    a.layer !== 'shared' &&
                    a.sliceChoice === '+ Create new slice',
                validate: (v) =>
                    v && v.trim().length > 0
                        ? true
                        : 'Slice name is required'
            },

            {
                type: 'input',
                name: 'name',
                message: 'Component name? (e.g. TransactionForm)',
                validate: (v) =>
                    v && v.trim().length > 0
                        ? true
                        : 'Name is required'
            },
            {
                type: 'confirm',
                name: 'withStory',
                message: 'Generate Storybook story?',
                default: false
            }
        ],

        actions: (answers) => {
            const component = '{{pascalCase name}}';

            const slice =
                answers.layer === 'shared'
                    ? null
                    : answers.sliceChoice === '+ Create new slice'
                    ? answers.sliceNew
                    : answers.sliceChoice;

            // 👇 чтобы slice был доступен в hbs
            answers.slice = slice;

            const basePath =
                answers.layer === 'shared'
                    ? `src/shared/ui/${component}`
                    : `src/${answers.layer}/${slice}/ui/${component}`;

            const tpl = (p) => path.join(__dirname, p);

            const actions = [
                {
                    type: 'add',
                    path: `${basePath}/${component}.tsx`,
                    templateFile: tpl(
                        'plop-templates/component/component.tsx.hbs'
                    )
                },
                {
                    type: 'add',
                    path: `${basePath}/${component}.module.scss`,
                    templateFile: tpl(
                        'plop-templates/component/component.module.scss.hbs'
                    )
                }
            ];

            if (answers.withStory) {
                actions.push({
                    type: 'add',
                    path: `${basePath}/${component}.stories.tsx`,
                    templateFile: tpl(
                        'plop-templates/component/component.stories.tsx.hbs'
                    )
                });
            }

            return actions;
        }
    });
};
