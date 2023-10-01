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

