import { Component, OnInit } from '@angular/core';
import { AuthGuard } from '../../../guard/auth.guard';
import { environment } from '../../../../environments/environment';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ModalChangePasswordComponent } from '../../widgets/modal-change-password/modal-change-password.component';

@Component({
  selector: 'app-section-header',
  templateUrl: './section-header.component.html',
  styleUrls: ['./section-header.component.css']
})
export class SectionHeaderComponent implements OnInit {

  title = 'msm-fe-swabber';
  public assetPath = environment.ASSET_PATH;
  public currentHospital: any = {};
  public currentUser: any = {};
  public hospitals: any;
  public key: any = JSON.parse(localStorage.getItem('key') || '{}');

  environment: any = environment.ENVIRONMENT_NAME;
  appVersion: any = '2.0';

  constructor(
    public auth: AuthGuard,
    private modalService: NgbModal,
    modalSetting: NgbModalConfig
  ) {
    modalSetting.backdrop = 'static';
    modalSetting.keyboard = false;
  }

  ngOnInit() {
    this.getInformation();
  }

  async getInformation() {

    const user = this.key.user;
    const hospital = this.key.hospital;
    const collection = this.key.collection;

    const name = user.fullname;
    this.currentHospital.name = hospital.name;
    this.currentHospital.alias = hospital.alias;
    this.currentUser.fullname = name.length > 20 ? name.substr(0, 20) + '...' : name;
    this.hospitals = collection;
  }

  getAllQueue() {

  }

  changeOrg(hospitalId: any) {
    const selectedOrg = hospitalId;
    const idx = this.hospitals.findIndex((i: any) => {
      return i.id === selectedOrg;
    });

    this.key.hospital = {
      id: this.hospitals[idx].id,
      orgId: this.hospitals[idx].orgId,
      name: this.hospitals[idx].name,
      alias: this.hospitals[idx].alias,
      zone: this.hospitals[idx].zone,
      isBpjs: this.hospitals[idx].isBpjs,
      isBridging: this.hospitals[idx].isBridging
    };

    localStorage.setItem('key', JSON.stringify(this.key));
  }

  changePasswordModal(css = 'change-password-modal') {
    const modalRef = this.modalService.open(ModalChangePasswordComponent, { windowClass: css, size: 'lg' });
    if (this.key.user.username) { modalRef.componentInstance.username = this.key.user.username; }
  }

}
