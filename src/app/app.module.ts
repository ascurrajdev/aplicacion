import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NumericInputDirective, NumberOnlyDirective } from './directives';

// Angular Material
import { MatCardModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatListModule } from '@angular/material';
import { MatSelectModule } from '@angular/material/select';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatExpansionModule } from '@angular/material/expansion';

// Custom
import { HomeComponent } from './components/home/home.component';
import { BusinessSheetComponent } from './components/business-sheet/business-sheet.component';
import { MainTableComponent } from './components/tables/main/main-table.component';
import { TableInputComponent } from './components/tables/table-input/table-input.component';
import { TableResultsComponent } from './components/tables/table-results/table-results.component';
import { TableTotalComponent } from './components/tables/table-total/table-total.component';
import { AlertConfirmComponent } from './components/alerts/alert-confirm/alert-confirm.component';
import { AlertInfoComponent } from './components/alerts/alert-info/alert-info.component';
import { LoginComponent  } from './components/login/login.component';

const appRoutes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'login', component: LoginComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    NumberOnlyDirective,
    NumericInputDirective,
    HomeComponent,
    MainTableComponent,
    TableInputComponent,
    TableTotalComponent,
    BusinessSheetComponent,
    AlertInfoComponent,
    TableResultsComponent,
    LoginComponent,
    AlertConfirmComponent
  ],
  imports: [
    RouterModule.forRoot(appRoutes, {enableTracing: false}),
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatButtonModule,
    MatCardModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatListModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
