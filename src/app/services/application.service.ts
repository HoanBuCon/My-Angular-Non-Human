import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Application } from '../models/application.model';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  private initialApps: Application[] = [
    {
      id: 1,
      name: 'NCCPlus - Tư vấn dịch vụ',
      creator: 'Nguyễn Thị Lan',
      createdAt: '01/12/2021',
      category: 'Sản phẩm điện tử',
      status: 'Đang sử dụng',
      channels: ['facebook', 'web'],
      userCount: 101,
      scriptCount: '01'
    },
    {
      id: 2,
      name: 'NCCAdvice',
      creator: 'Đinh Mai Hoa',
      createdAt: '01/03/2022',
      category: 'Bán lẻ',
      status: 'Tạm khóa',
      channels: ['facebook'],
      userCount: 200,
      scriptCount: '02'
    },
    {
      id: 3,
      name: 'NCCStore',
      creator: 'Lê Thị Hương',
      createdAt: '01/04/2022',
      category: 'Dịch vụ',
      status: 'Đang sử dụng',
      channels: ['web'],
      userCount: 103,
      scriptCount: '03'
    }
  ];

  private appsSubject = new BehaviorSubject<Application[]>(this.loadFromStorage());

  private loadFromStorage(): Application[] {
    const saved = localStorage.getItem('vss_applications');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing stored applications', e);
      }
    }
    return this.initialApps;
  }

  private saveToStorage(apps: Application[]): void {
    localStorage.setItem('vss_applications', JSON.stringify(apps));
    this.appsSubject.next(apps);
  }

  getApplications(): Observable<Application[]> {
    return this.appsSubject.asObservable();
  }

  addApplication(appData: Omit<Application, 'id'>): Observable<Application> {
    const current = this.appsSubject.value;
    const newId = current.length > 0 ? Math.max(...current.map(a => a.id)) + 1 : 1;
    const newApp: Application = {
      ...appData,
      id: newId
    };
    const updated = [newApp, ...current];
    this.saveToStorage(updated);
    return of(newApp);
  }

  updateApplication(id: number, appData: Partial<Application>): Observable<Application | null> {
    const current = this.appsSubject.value;
    const index = current.findIndex(a => a.id === id);
    if (index !== -1) {
      const updatedApp = { ...current[index], ...appData };
      current[index] = updatedApp;
      this.saveToStorage([...current]);
      return of(updatedApp);
    }
    return of(null);
  }

  deleteApplication(id: number): Observable<boolean> {
    const current = this.appsSubject.value;
    const updated = current.filter(a => a.id !== id);
    this.saveToStorage(updated);
    return of(true);
  }

  toggleStatus(id: number): Observable<Application | null> {
    const current = this.appsSubject.value;
    const index = current.findIndex(a => a.id === id);
    if (index !== -1) {
      const newStatus = current[index].status === 'Đang sử dụng' ? 'Tạm khóa' : 'Đang sử dụng';
      current[index] = { ...current[index], status: newStatus };
      this.saveToStorage([...current]);
      return of(current[index]);
    }
    return of(null);
  }
}
