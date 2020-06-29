/********************************************************************************
 * Copyright (c) 2020 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/

// utils for creating a temporary workspace folder
const temp = require('temp').track(); // Remove .track() if you'd like to keep the workspace and other temporary files after running the tests.
const fse = require('fs-extra');
// utils for parsing the theia port
const cliPortKey = '--theia-port';
const cliPortIndex = process.argv.indexOf(cliPortKey);
const masterPort = cliPortIndex > -1 ? process.argv[cliPortIndex + 1] : 0; // 0 if master
// utils for parsing the server path
// const defaultServerPath = '../server/org.eclipse.glsp.example.workflow/target/org.eclipse.glsp.example.workflow-0.8.0-SNAPSHOT-glsp.jar';
// const serverPathKey = '--server-path';
// const serverPathIndex = process.argv.indexOf(serverPathKey);
// const serverPath = serverPathIndex > -1 ? process.argv[serverPathIndex + 1] : defaultServerPath;
if (typeof masterPort === 'undefined') {
    throw new Error(`${cliPortKey} expects a number as following argument`);
}
// utils for defining the baseUrl
const port = masterPort;
const host = 'localhost';

export const createConfig = (headless: boolean): WebdriverIO.Config => {
    // let backendServer: any;
    return {
        //
        // ====================
        // Runner Configuration
        // ====================
        //
        // WebdriverIO allows it to run your tests in arbitrary locations (e.g. locally or
        // on a remote machine).
        runner: 'local',
        //
        // ==================
        // Specify Test Files
        // ==================
        // Define which test specs should run. The pattern is relative to the directory
        // from which `wdio` was called. Notice that, if you are calling `wdio` from an
        // NPM script (see https://docs.npmjs.com/cli/run-script) then the current working
        // directory is where your package.json resides, so `wdio` will be called from there.
        //
        specs: [
            './workflow/tests/*.ui-spec.ts'
        ],
        // Patterns to exclude.
        exclude: [
            // 'path/to/excluded/files'
        ],
        //
        // ============
        // Capabilities
        // ============
        // Define your capabilities here. WebdriverIO can run multiple capabilities at the same
        // time. Depending on the number of capabilities, WebdriverIO launches several test
        // sessions. Within your capabilities you can overwrite the spec and exclude options in
        // order to group specific specs to a specific capability.
        //
        // First, you can define how many instances should be started at the same time. Let's
        // say you have 3 different capabilities (Chrome, Firefox, and Safari) and you have
        // set maxInstances to 1; wdio will spawn 3 processes. Therefore, if you have 10 spec
        // files and you set maxInstances to 10, all spec files will get tested at the same time
        // and 30 processes will get spawned. The property handles how many capabilities
        // from the same test should run tests.
        //
        maxInstances: 1,
        //
        // If you have trouble getting all important capabilities together, check out the
        // Sauce Labs platform configurator - a great tool to configure your capabilities:
        // https://docs.saucelabs.com/reference/platforms-configurator
        //
        capabilities: [{

            // maxInstances can get overwritten per capability. So if you have an in-house Selenium
            // grid with only 5 firefox instances available you can make sure that not more than
            // 5 instances get started at a time.
            maxInstances: 1,
            //
            browserName: 'chrome',
            'goog:chromeOptions': {
                args: headless
                    ? ['--headless', '--disable-gpu', '--no-sandbox']
                    : []
            }
            // If outputDir is provided WebdriverIO can capture driver session logs
            // it is possible to configure which logTypes to include/exclude.
            // excludeDriverLogs: ['*'], // pass '*' to exclude all driver session logs
            // excludeDriverLogs: ['bugreport', 'server'],
        }],
        //
        // ===================
        // Test Configurations
        // ===================
        // Define all options that are relevant for the WebdriverIO instance here
        //
        // Level of logging verbosity: trace | debug | info | warn | error | silent
        logLevel: 'error',
        // retries
        specFileRetries: 3,
        // test result
        outputDir: 'wdio-results',
        //
        // Set specific log levels per logger
        // loggers:
        // - webdriver, webdriverio
        // - @wdio/applitools-service, @wdio/browserstack-service, @wdio/devtools-service, @wdio/sauce-service
        // - @wdio/mocha-framework, @wdio/jasmine-framework
        // - @wdio/local-runner, @wdio/lambda-runner
        // - @wdio/sumologic-reporter
        // - @wdio/cli, @wdio/config, @wdio/sync, @wdio/utils
        // Level of logging verbosity: trace | debug | info | warn | error | silent
        // logLevels: {
        //     webdriver: 'info',
        //     '@wdio/applitools-service': 'info'
        // },
        //
        // If you only want to run your tests until a specific amount of tests have failed use
        // bail (default is 0 - don't bail, run all tests).
        bail: 0,
        //
        // Set a base URL in order to shorten url command calls. If your `url` parameter starts
        // with `/`, the base url gets prepended, not including the path portion of your baseUrl.
        // If your `url` parameter starts without a scheme or `/` (like `some/path`), the base url
        // gets prepended directly.
        baseUrl: `http://${host}:${port}`,
        //
        // Default timeout for all waitFor* commands.
        waitforTimeout: 10000,
        //
        // Default timeout in milliseconds for request
        // if browser driver or grid doesn't send response
        connectionRetryTimeout: 90000,
        //
        // Default request retries count
        connectionRetryCount: 3,
        //
        // Test runner services
        // Services take over a specific job you don't want to take care of. They enhance
        // your test setup with almost no effort. Unlike plugins, they don't add new
        // commands. Instead, they hook themselves up into the test process.
        services: ['selenium-standalone'],

        // Framework you want to run your specs with.
        // The following are supported: Mocha, Jasmine, and Cucumber
        // see also: https://webdriver.io/docs/frameworks.html
        //
        // Make sure you have the wdio adapter package for the specific framework installed
        // before running any tests.
        framework: 'mocha',
        //
        // The number of times to retry the entire specfile when it fails as a whole
        // specFileRetries: 1,
        //
        // Whether or not retried specfiles should be retried immediately or deferred to the end of the queue
        // specFileRetriesDeferred: false,
        //
        // Test reporter for stdout.
        // The only one supported by default is 'dot'
        // see also: https://webdriver.io/docs/dot-reporter.html
        reporters: [
            ['junit', {
                outputDir: 'wdio-results/junit',
                outputFileFormat: (options: any) => {
                    return `wdio-junit-report-${options.capabilities.browserName}-${options.cid}.xml`;
                }
            }]
        ],

        //
        // Options to be passed to Mocha.
        // See the full list at http://mochajs.org/
        mochaOpts: {
            require: 'ts-node/register'
        },
        //
        // =====
        // Hooks
        // =====
        // WebdriverIO provides several hooks you can use to interfere with the test process in order to enhance
        // it and to build services around it. You can either apply a single function or an array of
        // methods to it. If one of them returns with a promise, WebdriverIO will wait until that promise got
        // resolved to continue.
        /**
         * Gets executed once before all workers get launched.
         * @param {Object} config wdio configuration object
         * @param {Array.<Object>} capabilities list of capabilities details
         */
        onPrepare: (config, capabilities) => {
            // create temp folder as root dir
            const rootDir = temp.mkdirSync();
            fse.copySync('./workflow/workspace', rootDir);

            // Save root dir to easily retrieve later
            process.argv.push('--theia-root-dir', rootDir);
            // same args as in package.json
            process.argv.push(' --hostname=0.0.0.0');
            process.argv.push('--WORKFLOW_LSP=5007');
            process.argv.push(`--root-dir=${rootDir}`);
            process.argv.push('--log-config=./configs/log.config.json');
            process.argv.push('--plugins=local-dir:./plugins');

            require('../workflow/browser-app/src-gen/backend/server')(port, host);

            // start backend server
            // const spawn = require('child_process').spawn;
            // backendServer = spawn('java', ['-jar', serverPath]);
        },
        /**
         * Gets executed before a worker process is spawned and can be used to initialise specific service
         * for that worker as well as modify runtime environments in an async fashion.
         * @param  {String} cid      capability id (e.g 0-0)
         * @param  {[type]} caps     object containing capabilities for session that will be spawn in the worker
         * @param  {[type]} specs    specs to be run in the worker process
         * @param  {[type]} args     object that will be merged with the main configuration once worker is initialised
         * @param  {[type]} execArgv list of string arguments passed to the worker process
         */
        // onWorkerStart: function (cid, caps, specs, args, execArgv) {
        // },
        /**
         * Gets executed just before initialising the webdriver session and test framework. It allows you
         * to manipulate configurations depending on the capability or spec.
         * @param {Object} config wdio configuration object
         * @param {Array.<Object>} capabilities list of capabilities details
         * @param {Array.<String>} specs List of spec file paths that are to be run
         */
        // beforeSession: function (config, capabilities, specs) {
        // },
        /**
         * Gets executed before test execution begins. At this point you can access to all global
         * variables like `browser`. It is the perfect place to define custom commands.
         * @param {Array.<Object>} capabilities list of capabilities details
         * @param {Array.<String>} specs List of spec file paths that are to be run
         */
        before: (capabilities, specs) => {
            require('ts-node').register({ files: true });

            // adjust window size
            browser.setWindowSize(2560, 1600);

            // open temporary workspace
            browser.url('/');
            const rootDirIndex = process.argv.findIndex(
                value => value === '--theia-root-dir'
            );
            const workspaceUrl =
                browser.getUrl() + '#' + process.argv[rootDirIndex + 1];
            browser.url(workspaceUrl);

            browser.waitUntil(() => !$('.theia-preload').isExisting(), { timeout: 30000 });

            // set browser keyboard layout
            browser.keys(['Control', 'Shift', 'p']);
            browser.keys(['Control', 'Shift']);
            const commandPalette = $('.quick-open-tree');
            let selected = commandPalette.$('.monaco-tree-row[aria-selected="true"]');

            while (!selected.getText().startsWith('Keyboard')) {
                browser.keys('ArrowDown');
                selected = commandPalette.$('.monaco-tree-row[aria-selected="true"]');
            }
            browser.keys('Enter');
            selected = commandPalette.$('.monaco-tree-row[aria-selected="true"]');

            while (!selected.getText().startsWith('US')) {
                browser.keys('ArrowDown');
                selected = commandPalette.$('.monaco-tree-row[aria-selected="true"]');
            }
            browser.keys('Enter');
        },
        /**
         * Runs before a WebdriverIO command gets executed.
         * @param {String} commandName hook command name
         * @param {Array} args arguments that command would receive
         */
        // beforeCommand: function (commandName, args) {
        // },
        /**
         * Hook that gets executed before the suite starts
         * @param {Object} suite suite details
         */
        // beforeSuite: function (suite) {
        // },
        /**
         * Function to be executed before a test (in Mocha/Jasmine) starts.
         */
        // beforeTest: function (test, context) {
        // },
        /**
         * Hook that gets executed _before_ a hook within the suite starts (e.g. runs before calling
         * beforeEach in Mocha)
         */
        // beforeHook: function (test, context) {
        // },
        /**
         * Hook that gets executed _after_ a hook within the suite starts (e.g. runs after calling
         * afterEach in Mocha)
         */
        // afterHook: function (test, context, { error, result, duration, passed, retries }) {
        // },
        /**
         * Function to be executed after a test (in Mocha/Jasmine).
         */
        // afterTest: function(test, context, { error, result, duration, passed, retries }) {
        // },


        /**
         * Hook that gets executed after the suite has ended
         * @param {Object} suite suite details
         */
        // afterSuite: function (suite) {
        // },
        /**
         * Runs after a WebdriverIO command gets executed
         * @param {String} commandName hook command name
         * @param {Array} args arguments that command would receive
         * @param {Number} result 0 - command success, 1 - command error
         * @param {Object} error error object if any
         */
        // afterCommand: function (commandName, args, result, error) {
        // },
        /**
         * Gets executed after all tests are done. You still have access to all global variables from
         * the test.
         * @param {Number} result 0 - test pass, 1 - test fail
         * @param {Array.<Object>} capabilities list of capabilities details
         * @param {Array.<String>} specs List of spec file paths that ran
         */
        // after: (result, capabilities, specs) => {
        // },
        /**
         * Gets executed right after terminating the webdriver session.
         * @param {Object} config wdio configuration object
         * @param {Array.<Object>} capabilities list of capabilities details
         * @param {Array.<String>} specs List of spec file paths that ran
         */
        // afterSession: function (config, capabilities, specs) {
        // },
        /**
         * Gets executed after all workers got shut down and the process is about to exit. An error
         * thrown in the onComplete hook will result in the test run failing.
         * @param {Object} exitCode 0 - success, 1 - fail
         * @param {Object} config wdio configuration object
         * @param {Array.<Object>} capabilities list of capabilities details
         * @param {<Object>} results object containing test results
         */
        onComplete: (exitCode, config, capabilities, results) => {
            // backendServer.kill();
        },
        /**
        * Gets executed when a refresh happens.
        * @param {String} oldSessionId session ID of the old session
        * @param {String} newSessionId session ID of the new session
        */
        // onReload: function(oldSessionId, newSessionId) {
        // }
    };
};
