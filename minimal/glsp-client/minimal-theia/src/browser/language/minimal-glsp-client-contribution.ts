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
import { BaseGLSPClientContribution } from '@eclipse-glsp/theia-integration/lib/browser';
import { injectable } from 'inversify';

import { MinimalLanguage } from '../../common/minmal-language';

@injectable()
export class MinimalGLSPClientContribution extends BaseGLSPClientContribution {
    readonly id = MinimalLanguage.Id;
    readonly name = MinimalLanguage.Name;
    readonly fileExtensions = [MinimalLanguage.FileExtension];
}
