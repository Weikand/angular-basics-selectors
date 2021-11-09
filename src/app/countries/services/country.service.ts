import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Country, CountrySmall} from "../interfaces/countries.interface";
import {combineLatest, Observable, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  private _baseUrl: string = 'https://restcountries.com/v3.1';
  private _regions: string[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

  get regions(): string[] {
       return [...this._regions];
  }

  constructor(private http:HttpClient) { }

  getCountriesByRegion( region:string ): Observable<CountrySmall[]> {
    const url: string = `${this._baseUrl}/region/${region}?fields=name,cca3`
    return this.http.get<CountrySmall[]>(url)
  }

  getCountryByAlphaCode( cca3:string ): Observable<Country[] > {

    if(!cca3) {
      return of([])
    }

    const url: string = `${this._baseUrl}/alpha/${cca3}`
    return this.http.get<Country[]>(url)
  }

  getCountrySmallByAlphaCode ( cca3:string ): Observable<CountrySmall> {
    const url: string = `${this._baseUrl}/alpha/${cca3}?fields=name,cca3`
    return this.http.get<CountrySmall>(url)
  }

  getCountryByBorders (borders:string[] ): Observable<CountrySmall[]> {

    if(!borders){
      return of([]);
    }

    const requests: Observable<CountrySmall>[] = [];

    borders.forEach(border => {
      const request = this.getCountrySmallByAlphaCode(border);
      requests.push( request );
      });

    return combineLatest( requests );
  }
}
