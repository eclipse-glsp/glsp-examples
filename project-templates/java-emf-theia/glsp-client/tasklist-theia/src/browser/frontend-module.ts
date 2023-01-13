/********************************************************************************
 * Copyright (c) 2022-2024 EclipseSource and others.
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
import { PropertyDataService } from '@theia/property-view/lib/browser/property-data-service';
import { PropertyViewWidgetProvider } from '@theia/property-view/lib/browser/property-view-widget-provider';
import { TaskListLanguage } from '../common/tasklist-language';
import { TaskListDiagramConfiguration } from './diagram/tasklist-diagram-configuration';
import { GlspPropertyDataService } from './property-view/custom-data-service';
import { GlspPropertyViewWidgetProvider } from './property-view/custom-widget-provider';

export class TaskListTheiaFrontendModule extends GLSPTheiaFrontendModule {
    readonly diagramLanguage = TaskListLanguage;

    bindDiagramConfiguration(context: ContainerContext): void {
        context.bind(DiagramConfiguration).to(TaskListDiagramConfiguration);
    }

    override configure(context: ContainerContext): void {
        super.configure(context);
        context.bind(PropertyDataService).to(GlspPropertyDataService).inSingletonScope();
        context.bind(PropertyViewWidgetProvider).to(GlspPropertyViewWidgetProvider).inSingletonScope();
    }
}

export default new TaskListTheiaFrontendModule();
