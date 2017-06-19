import { NgModule } from '@angular/core';
import { ButtonComponent } from './components/button/button.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {MockDataGeneratorService} from './services/mock-data-generator.service';

@NgModule({
    declarations: [
        ButtonComponent
    ],
    exports: [ButtonComponent, CommonModule, FormsModule],
    providers: [MockDataGeneratorService]
})
export class SharedModule {
}
