import { NgModule } from '@angular/core';
import { SharedModule} from '../shared/shared.module';
import { HomeComponent } from './home.component';
import { LogStatusPannelComponent } from './log-status-pannel/log-status-pannel.component';
import { RecordsTableComponent } from './records-table/records-table.component';

@NgModule({
  imports: [SharedModule],
  declarations: [
    HomeComponent,
    LogStatusPannelComponent,
    RecordsTableComponent
  ],
  exports: [HomeComponent]
})
export class HomeModule {
}
