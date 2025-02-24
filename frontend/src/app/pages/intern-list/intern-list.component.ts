import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar.component'; // ✅ Import NavbarComponent
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-intern-list',
  standalone: true,
  templateUrl: './intern-list.component.html',
  styleUrls: ['./intern-list.component.css'],
  imports: [CommonModule, NavbarComponent, FormsModule, RouterModule]
})
export class InternListComponent {
  managerId!: number;
  interns = [
    { id: 101, name: 'Alice', program: 'Software Dev', expertise: 'Java', sme: 'David' },
    { id: 102, name: 'Bob', program: 'AI/ML', expertise: 'Python', sme: 'Sarah' }
  ];

  // ✅ Merged both constructors into one
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private usersService: UsersService
  ) {
    this.managerId = +this.route.snapshot.paramMap.get('managerId')!;
  }

  addIntern() {
    this.router.navigate(['/add-intern', this.managerId]);
  }

  ngOnInit() {
    this.usersService.getUsers().subscribe((data: any) => {
      console.log("fetceh", data);
      this.interns = data;
    });
  }
}
