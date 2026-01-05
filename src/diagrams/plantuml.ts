export const PLANTUML_USECASE = `@startuml
actor "Job Seeker" as JS
actor "Employer" as EM
actor "Admin" as AD
rectangle "UniSZA e-Job" {
  (Browse Jobs) as B
  (Apply Job) as A
  (Create Job) as C
  (Moderate) as M
}
JS --> B
JS --> A
EM --> C
AD --> M
@enduml`;

export const PLANTUML_SEQUENCE_APPLY = `@startuml
actor JobSeeker
participant App
participant LocalStorage
JobSeeker -> App: Open Job Detail
App -> LocalStorage: Save application
LocalStorage --> App: Confirmation
App -> JobSeeker: Show confirmation
@enduml`;

export const PLANTUML_SEQUENCE_APPROVE = `@startuml
actor Employer
participant App
participant LocalStorage
Employer -> App: Change application status to accepted
App -> LocalStorage: Update status
App -> Employer: Show updated list
@enduml`;

export const PLANTUML_ACTIVITY_POST = `@startuml
start
:Employer logs in;
:Open Create Job Form;
:Fill details;
if (Save draft?) then (yes)
  :Save draft;
else
  :Publish job;
endif
stop
@enduml`;

export const PLANTUML_ACTIVITY_APPLICATION = `@startuml
start
:Student apply for job;
:Employer review;
if (accept?) then (yes)
  :Employer confirm and schedule;
else
  :Employer reject;
endif
stop
@enduml`;

export const PLANTUML_DEPLOYMENT = `@startuml
node "Client Browser" {
  component "React App"
}
node "Vercel" {
  component "Static Site"
}
React App -> Static Site: fetch assets
@enduml`;

export const PLANTUML_COMPONENT = `@startuml
package "Frontend" {
  component Auth
  component Jobs
  component Applications
  component Profile
  component ProjectInfo
}
Auth --> Profile
Jobs --> Applications
@enduml`;
