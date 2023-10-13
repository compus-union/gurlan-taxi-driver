export enum StatusLicenseDocuments {
  VALID = "VALID", // Ready to use
  INVALID = "INVALID", // Not valid documents
  NONE = "NONE", // No documents at all
}

export enum StatusDriver {
  ONLINE = "ONLINE", // Ready for requests
  GOINGTOCLIENT = "GOINGTOCLIENT", // Has request, going to pick up the client
  WAITING = "WAITING", // Has client, waiting the client
  ONTHEWAY = "ONTHEWAY", // Has client, driving client to the destination
  BANNED = "BANNED", // Just fucked up
  LIMITED = "LIMITED", // Registered, all the information is being checked by admins
  OFFLINE = "OFFLINE", // Not using the app
  APPROVED = "APPROVED", // approved by admins
}

export enum DriverTypes {
  COMFORT = "COMFORT",
  STANDARD = "STANDARD",
  DAMAS = "DAMAS",
  LABO = "LABO",
  NOTMEASURED = "NOTMEASURED",
}

export enum DriverResponseStatus {
  DRIVER_NOT_FOUND = "DRIVER_NOT_FOUND",
  HEADERS_NOT_FOUND = "HEADERS_NOT_FOUND",
  DRIVER_TOKEN_NOT_FOUND = "DRIVER_TOKEN_NOT_FOUND",
  DRIVER_TOKEN_NOT_VALID = "DRIVER_TOKEN_NOT_VALID",
  DRIVER_BANNED = "DRIVER_BANNED",
  DRIVER_SELF_ACCESS_NOT_VALID = "DRIVER_SELF_ACCESS_NOT_VALID",
  AUTH_WARNING = "AUTH_WARNING",
  VALIDATION_WAITING = "VALIDATION_WAITING",
  VALIDATION_DONE = "VALIDATION_DONE",
  VALIDATION_FAILED = "VALIDATION_FAILED",
  DRIVER_EXISTS = "DRIVER_EXISTS",
  IMAGES_SENT = "IMAGES_SENT",
  IMAGES_SENT_FAILED = "IMAGES_SENT_FAILED",
  REGISTRATION_DONE = "REGISTRATION_DONE",
  LOGIN_DONE = "LOGIN_DONE",
  UNKNOWN_ERR = "UNKNOWN_ERR",
  LOGIN_FAILED = 'LOGIN_FAILED'
}

export enum UniversalResponseStatus {
  ERR_NETWORK = "ERR_NETWORK",
}

export enum DriverValidation {
  VALIDATED = "validated",
  INVALIDATED = "invalidated",
  WAITING = "waiting",
  SUCCESS = "done",
}
