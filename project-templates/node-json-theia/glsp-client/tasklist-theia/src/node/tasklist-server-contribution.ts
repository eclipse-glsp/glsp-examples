/********************************************************************************
 * Copyright (c) 2022 EclipseSource and others.
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
import { GLSPSocketServerContribution, GLSPSocketServerContributionOptions } from '@eclipse-glsp/theia-integration/lib/node';
import { injectable } from 'inversify';
import * as path from 'path';
import { TaskListLanguage } from '../common/tasklist-language';

const DEFAULT_SERVER_PORT = '5007';

export const LOG_DIR = path.join(__dirname, '..', '..', 'logs');
const MODULE_PATH = path.join(__dirname, '..', '..', '..', '..', 'glsp-server', 'bundle', 'tasklist-glsp-server-packed.js');

@injectable()
export class TaskListServerContribution extends GLSPSocketServerContribution {
    readonly id = TaskListLanguage.contributionId;

    createContributionOptions(): Partial<GLSPSocketServerContributionOptions> {
        return {
            executable: MODULE_PATH,
            socketConnectionOptions: { port: JSON.parse(process.env.TASKLIST_SERVER_PORT || DEFAULT_SERVER_PORT) },
            additionalArgs: ['--no-consoleLog', '--fileLog', '--logDir', LOG_DIR]
        };
    }
}
