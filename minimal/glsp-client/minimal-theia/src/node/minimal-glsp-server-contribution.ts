/********************************************************************************
 * Copyright (c) 2020-2022 EclipseSource and others.
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
import { getPort } from '@eclipse-glsp/protocol';
import { JavaSocketServerContribution, JavaSocketServerLaunchOptions } from '@eclipse-glsp/theia-integration/lib/node';
import { injectable } from '@theia/core/shared/inversify';
import { join, resolve } from 'path';
import { MinimalLanguage } from '../common/minimal-language';

export const PORT_ARG_KEY = 'MINIMAL_GLSP';
const JAR_FILE = resolve(
    join(__dirname, '..', '..', '..', '..', 'glsp-server', 'target', 'org.eclipse.glsp.example.minimal-0.9.0-glsp.jar')
);

@injectable()
export class MinimalGLSPServerContribution extends JavaSocketServerContribution {
    readonly id = MinimalLanguage.contributionId;

    createLaunchOptions(): Partial<JavaSocketServerLaunchOptions> {
        return {
            jarPath: JAR_FILE,
            additionalArgs: ['--consoleLog', 'true'],
            socketConnectionOptions: {
                port: getPort(PORT_ARG_KEY)
            }
        };
    }
}
