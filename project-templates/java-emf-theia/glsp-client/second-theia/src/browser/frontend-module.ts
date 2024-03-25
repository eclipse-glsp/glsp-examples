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
import { ContainerContext, DiagramConfiguration, GLSPTheiaFrontendModule } from '@eclipse-glsp/theia-integration';
import { SecondLanguage } from '../common/second-language';
import { SecondDiagramConfiguration } from './diagram/tasklist-diagram-configuration';

export class SecondTheiaFrontendModule extends GLSPTheiaFrontendModule {
    readonly diagramLanguage = SecondLanguage;
    protected override enableCopyPaste = false;
    protected override enableLayoutCommands = false;
    protected override enableMarkerNavigationCommands = false;

    bindDiagramConfiguration(context: ContainerContext): void {
        context.bind(DiagramConfiguration).to(SecondDiagramConfiguration);
    }

    override bindGLSPClientContribution(context: ContainerContext): void {
        // don't bind an additional client contribution. A contribution for the id is already bound via
        // the tasklist frontend module
    }
}

export default new SecondTheiaFrontendModule();
