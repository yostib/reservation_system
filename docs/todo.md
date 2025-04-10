# Requirement

* Login is only required when booking from own device.
* Signage display at the locations allow booking without login.
* Show booking calendar in home page.

![A draft scratch of the booking calendar view.](booking-calander-view-scratch.jpg)

# TODO 
 
- [x] **RSRV-0001 : Reservation time restriction**

  As a user I should be able to make reservation between 9:00 to 21:00. There should be a time restriction for reservations.  

- [x] **RSRV-0002 : The reservation form should have a half-hour interval**

- [x] **RSRV-0003 : Add `startTime` and `endTime` in the form.**
- [ ] **RSRV-0004 : Reservation form validation** 
  - [x] RSRV-0005 : The `endTime` cannot be before the `startTime`.
    - [x] Validate the date. Date cannot be in the past.
  - [ ] RSRV-0006 : The smallest amount of time the user should be able to book is one hour.
  - [ ] RSRV-0007 : The laundry machine ID should be a dropdown select. (This task still needs to be refined)
  - [ ] RSRV-0008 : The available slot for laundry should be displayed per machine selection. Example, one machine could be available for booking when the other is all booked.
  - [ ] RSRV-0009 : The sauna room number should be a dropdown select.
  - [ ] RSRV-0010 : The available slot for sauna should be displayed per room selection.
- [ ] **RSRV-0011 : The reservation is missing end time.**
- [ ] **RSRV-0012 : Create a home view (the first thing the user sees should be a login) the user should login to access the time booking.**
    - [ ] RSRV-0013 : Fetch timetable one week at a time
    - [x] RSRV-0018 : Create bare-bone calendar view.
    - [ ] RSRV-0014 : Show the available slots as interactive (selectable) UI elements.
    - [ ] RSRV-0015 : Show already booked slots as grayed-out/disabled/unselectable UI elements.
    - [ ] RSRV-0019 : Show confirmation dialog when user clicks reserve button.
- [ ] **RSRV-0016 : Create responsive booking calendar view for mobile users.**

- [ ] **RSRV-0017 : Use data models to create objects with them.**
- [ ] **RSRV-0018 : Modified routing and the first page to be displayed to be login.**
- [ ] **RSRV-0019 : More on routing modified the Dashboard to be user-specific with styling and options.**
- [ ] **RSRV-0020 : More on routing after Dashboard the booking calendar is displayed.**
- [ ] **RSRV-0021 :modify the todo list.**
