/********************************************************************************
 * Copyright (c) 2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied:
 * -- GNU General Public License, version 2 with the GNU Classpath Exception
 * which is available at https://www.gnu.org/software/classpath/license.html
 * -- MIT License which is available at https://opensource.org/license/mit.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0 OR MIT
 ********************************************************************************/
import { GLSPSocketServerContribution, GLSPSocketServerContributionOptions } from '@eclipse-glsp/theia-integration/lib/node';
import { injectable } from 'inversify';
import * as path from 'path';
import { TaskListLanguage } from '../common/tasklist-language';

const DEFAULT_PORT = 0;
const PORT_ARG_KEY = 'TASKLIST_GLSP';
export const LOG_DIR = path.join(__dirname, '..', '..', 'logs');
const MODULE_PATH = require.resolve('tasklist-glsp-server');

@injectable()
export class TaskListServerContribution extends GLSPSocketServerContribution {
    readonly id = TaskListLanguage.contributionId;

    createContributionOptions(): Partial<GLSPSocketServerContributionOptions> {
        return {
            executable: MODULE_PATH,
            socketConnectionOptions: { port: getPort(PORT_ARG_KEY, DEFAULT_PORT), host: '127.0.0.1' },
            additionalArgs: ['--no-consoleLog', '--fileLog', '--logDir', LOG_DIR]
        };
    }
}

// TEMP: Until XXX is merged
/**
 * Utility function to parse a server port that is defined via command line arg.
 * @param argsKey Name/Key of the commandLine arg
 * @param defaultPort Default port that should be returned if no (valid) port was passed via CLI#
 * @returns the path value of the given argument if set, default value or `NaN` instead.
 */
export function getPort(argsKey: string, defaultPort?: number): number {
    argsKey = `--${argsKey.replace('--', '').replace('=', '')}=`;
    const args = process.argv.filter(a => a.startsWith(argsKey));
    if (args.length > 0) {
        return Number.parseInt(args[0].substring(argsKey.length), 10);
    }
    return defaultPort ?? NaN;
}
