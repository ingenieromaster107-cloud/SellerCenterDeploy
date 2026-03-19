export interface ICustomer {
  firstname?: string
  lastname?: string
  email: string
  identificationNumber?: IIdentificationNumber[]
  identificationType?: IIdentificationType[]
  addresses?: IAddress[]
}

export interface IIdentificationNumber {
  code: string
  value: string
}

export interface IIdentificationType {
  code: string
}

export interface IAddress {
  id: number
  firstname?: string
  lastname?: string
  street?: string[]
  city?: string
  region?: IRegion
  telephone?: string
  default_billing?: boolean
  default_shipping?: boolean
}

export interface IRegion {
  region_id: number
  region_code: string
}
