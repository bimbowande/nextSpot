import { observable, action, computed, runInAction } from 'mobx';
import { persist, create } from 'mobx-persist'
import CreateStaff from '../container/CreateStaff';
import { http, setAuthorizationToken, saveToLocalStorage } from '../utils/main'

class BirdStore{
  @observable user = {};
  @observable staffs = [];
  @observable staffDetails = {};
  @observable partners = [];
  @observable customers = [];
  @observable partnerDetails = {};
  @observable customerDetails ={};
  @observable currentPartnerId = '';
  @observable profileInfo ={};
  @observable partnerRequests = {};
  @observable loanRequests = [];
  @observable loanRequestDetails = {};
  @observable customerRecords = {};
  @observable loanHistory= {}; 
  @observable loader = true;

  @action
  loginUser(payload) {
    return http.post('staff/login', payload)
    .then(resp => {
      return resp.data;
     })
  }
 
  @action
  verifyOtp(payload) {
    this.user = {}
    const { data: { email, id } } = JSON.parse(localStorage.getItem('login-data'))
    return http.post(`staff/verifyotp?email=${email}&id=${id}`, payload)
    .then((response) => {
      runInAction(() => {
        this.user = response.data.user
      })
      return response.data
    })
  }


  @action
  createStaff(payload) {
    // const token = localStorage.getItem('auth-token');
    return http.post('/staff/createaccount', payload)
    .then(resp => resp.data)
  }

  @action
  getAllStaff() {
    this.staffs = [];
    this.loader = true;
    return http.get('/staffs')
    .then((response) => {
      runInAction(() => {
        this.staffs = response.data.staffs
        this.loader = false;
      })
      return response.data;
    });
  }

  @action
  createCorporateAcc(payload) {
    http.defaults.headers.post['Content-Type'] = 'multipart/form-data';
    return http.post('/staff/partneraccount/create', payload)
    .then((response) => response.data)
  }
  //updates user role
  @action 
  updateUserRole(id,payload){
    console.log(payload);
    return http.put(`/staff/updaterole?id=${id}`, payload)
    .then((response)=> {
    })
  }

  @action 
  getUserActivity(id){
    return http.get(`/staff/activity?staffid=${id}`)
    .then((response)=> {
      console.log(response)
    })
  }

  @action 
  staffProfile(){
    this.profileInfo = {};
    this.loader = true;
    return http.get(`/staff/profile`)
    .then((response) => {
      runInAction(() => {
        this.profileInfo = response.data.staff
        this.loader = false;
        console.log(response.data.staff)
      })
      return response.data;
    })
  }

  @action
  getAllPartners() {
    this.partners = [];
    console.log(this.partners);
    this.loader = true;
    return http.get('/staff/partneraccounts')
    .then((response) => {
      runInAction(() => {
        this.partners = response.data.partners;
        console.log(this.partners);
        this.loader = false;
      })
      return response.data
    })
  }


  @action 
  getAllCustomers(){
    this.customers = [];
    this.loader = true;
    return http.get('/staff/customeraccounts')
    .then((response)=>{
      runInAction(() => {
        this.customers = response.data.customers;
        this.loader = false;
        console.log(response.data.customers)
      })
      return response.data
    })
  }


  @action
  updateStaffDetails(id){
    this.staffDetails = {};
    this.loader = true;
    return http.get(`/staff?staffId=${id}`)
    .then((response) => {
      runInAction(() => {
        this.staffDetails = response.data.staff;
        this.loader = false;
        // console.log(response.data.staff)
        saveToLocalStorage('staffId',response.data.staff.id)
      })
      return response.data;
    })
  }

  @action
   getStaffId(id){
    saveToLocalStorage('staffLoginID',id);
  }

  @action
  getCustomerId(id){
    saveToLocalStorage('CustomerID',id);
  }
   
  @action
  getPartnerDetails(id) {
    this.partnerDetails = {};
    return http.get(`/staff/partneraccount/details?id=${id}`)
    .then((response) => {
      runInAction(() => {
        this.partnerDetails = response.data.details;
        saveToLocalStorage('partnerId', response.data.details.partner.id)
      })
      return response.data;
    })
  }

  @action
  getCustomerLoanRequestHistory(id){
    this.loanHistory = {};
    return http.get(`/staff/customeraccount/loanrequest/history?customerId=${id}`)
    .then((response) => {
      runInAction(()=>{
        console.log(response.data.details);
      })
      return response.data;
    })
  }

  @action 
  repaymentHistory(id){
    this.loanHistory = {};
    return http.get(`/staff/customeraccount/repayments/history?customerId=${id}`)
    .then((response) => {
      runInAction(()=>{
        console.log(response.data.details);
      })
      return response.data;
    })
  }

  @action
  getPartnerRequest(id) {
    this.partnerRequests = {};
    return http.get(`/staff/partneraccount/requests?id=${id}`)
    .then((response) => {
      runInAction(() => {
        this.partnerRequests = response.data.details;
        saveToLocalStorage('partnerRequestId', response.data.details.partner.id)
      })
      return response.data;
    })
  }

  @action
  partnerRequestEdit(id) {
    return http.put(`/staff/partneraccount/partnerstaff/update?partnerStaffId=${id}`)
    .then(response => response.data)
  }

  @action
  partnerRequestDelete(id) {
    return http.delete(`/staff/partneraccount/partnerstaff/delete?partnerStaffId=${id}`)
    .then(response => response.data)
  }

  @action
  getAllLoanRequests() {
    this.loader = true;
    return http.get('/staff/customeraccount/loanrequests')
    .then((response) => {
      runInAction(() => {
        this.loanRequests = response.data.requests;
        this.loader = false;
      })
      return response.data;
    })
  }

  @action
  getAloanRequest(id) {
    this.loader = true;
    return http.get(`/staff/customeraccount/loanrequest?requestId=${id}`)
    .then((response) => {
      saveToLocalStorage('currentLoanDetails', response.data.loanRequest.id)
      console.log(response.data, '-----------')
      this.loader = false;
      this.loanRequestDetails = response.data.loanRequest
      return response.data
    })
  }

  @action
  processLoanRequest(payload, id) {
    return http.put(`/staff/customeraccount/loanrequest/process?requestId=${id}`, payload)
    .then(response => response)
  }

  @action
  declineLoanRequest(payload, id) {
    return http.put(`/staff/customeraccount/loanrequest/decline?requestId=${id}`, payload)
    .then(response => response)
  }

  @action
  getCustomerRecords(id) {
    return http.get(`/staff/customeraccount/details?customerId=${id}`)
    .then((response) => {
      this.customerRecords = response.data.records;
      console.log(response.data, '--------_______')
      return response.data;
    })
  }

  //change staff Password
  changeStaffPassword(payload){
    console.log(payload);
    return http.put(`/staff/password/change`,payload)
    .then((response) => console.log(response))
  }

  //update Staff Details
  updateAccount(payload){
    console.log(payload)
    return http.put(`/staff/updateaccount`,payload)
    .then((response)=>console.log(response))
  }

}

const store  = new BirdStore();

export default store;

//mobex store