import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './layout/header/header-component';
import { Footer } from './layout/footer/footer-component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './app-component.html',
  styleUrl: './app-component.css'
})
export class App { }
