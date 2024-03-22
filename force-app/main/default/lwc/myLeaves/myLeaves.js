/* eslint-disable no-unused-vars */
/* eslint-disable eqeqeq */
import { LightningElement, wire } from "lwc";
import getMyLeaves from "@salesforce/apex/LeaveRequstController.getMyLeaves";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

const COLUMNS = [
  {
    label: "Request Id",
    fieldName: "Name",
    cellAttributes: { class: { fieldName: "cellClass" } }
  },
  {
    label: "From Date",
    fieldName: "From_Date__c",
    cellAttributes: { class: { fieldName: "cellClass" } }
  },
  {
    label: "To Date",
    fieldName: "To_Date__c",
    cellAttributes: { class: { fieldName: "cellClass" } }
  },
  {
    label: "Reason",
    fieldName: "Reason__c",
    cellAttributes: { class: { fieldName: "cellClass" } }
  },
  {
    label: "Status",
    fieldName: "Status__c",
    cellAttributes: { class: { fieldName: "cellClass" } }
  },
  {
    label: "Manager Comment",
    fieldName: "Manager_Comment__c",
    cellAttributes: { class: { fieldName: "cellClass" } }
  },
  {
    type: "button",
    typeAttributes: {
      label: "Edit",
      name: "Edit",
      title: "Edit",
      value: "edit",
      disabled: { fieldName: "isEditDisabled" },
      cellAttributes: { class: { fieldName: "cellClass" } }
    }
  }
];
export default class MyLeaves extends LightningElement {
  columns = COLUMNS;
  myLeaves = [];
  myLeavesWireResult;
  showModalPopup = false;
  objectApiName = "LeaveRequest__c";
  recordId = "";
  @wire(getMyLeaves)
  wiredMyLeaves(result) {
    this.myLeavesWireResult = result;
    if (result.data) {
      this.myLeaves = result.data.map((a) => ({
        ...a,
        cellClass:
          a.Status__c == "Approved"
            ? "slds-theme_success"
            : a.Status__c == "Rejected"
              ? "slds-theme_warning"
              : "",
        isEditDisabled: a.Status__c != "Pending"
      }));
    }
    if (result.error) {
      console.log("ErrorOccured while fetching my leaves", result.error);
    }
  }

  get noRecordsFound() {
    return this.myLeaves.length === 0;
  }
  popupCloseHandler() {
    this.showModalPopup = false;
  }
  rowActionHandler(event) {
    this.showModalPopup = true;
    this.recordId = event.detail.row.Id;
  }
  successHandler(event) {
    this.showModalPopup = false;
    this.showToast("Data saved Successfully");
  }
  showToast(message, title = "success", variant = "Success") {
    const event = new ShowToastEvent({
      title,
      message,
      variant
    });
    this.dispatchEvent(event);
  }
}
