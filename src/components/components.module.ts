import { NgModule,CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { DistanceMeasureComponent } from './discard/discard';


@NgModule({
	declarations: [DistanceMeasureComponent],
	imports: [],
	exports: [DistanceMeasureComponent,],
	schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class ComponentsModule {}
