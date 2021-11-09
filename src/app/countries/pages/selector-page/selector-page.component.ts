import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CountryService} from "../../services/country.service";
import {Country, CountrySmall} from "../../interfaces/countries.interface";
import {count, switchMap, tap} from "rxjs/operators";

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [
  ]
})
export class SelectorPageComponent implements OnInit {

  myForm: FormGroup = this.fb.group({
    region: ['', Validators.required],
    country: ['', Validators.required],
    border: ['', Validators.required]
  })

  // fill selectors
  regions: string[] = [];
  countries: CountrySmall[] = [];
  // borders: string[] = [];
  borders: CountrySmall[] = [];

  loading: boolean = false;

  constructor( private fb: FormBuilder,
               private countryService: CountryService) { }

  ngOnInit(): void {
    this.myForm.get('region')?.valueChanges
      .pipe(
        tap((_) => {
          this.myForm.get('country')?.reset('');
          this.loading = true;
          // this.myForm.get('country')?.enable();
          // this.myForm.get('border')?.disable();
        }),
        switchMap( region => this.countryService.getCountriesByRegion(region))
      )
      .subscribe( countries => {
        this.countries = countries;
        this.loading = false;
      })

    this.myForm.get('country')?.valueChanges
      .pipe(
        tap((_) => {
          this.borders = [];
          this.myForm.get('border')?.reset('');
          this.loading = true;
          // this.myForm.get('border')?.enable();

        }),
        switchMap( cca3 => this.countryService.getCountryByAlphaCode(cca3)),
        switchMap( (country) => this.countryService.getCountryByBorders(country[0]?.borders)
        ),
      )
      .subscribe( countries => {
        this.loading = false;
        this.borders = countries;

      })

    this.regions = this.countryService.regions;

  }

  save() {
    console.log(this.myForm.value);
  }

}
