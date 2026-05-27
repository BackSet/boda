export type PublicBankAccount = {
  id: number
  bankName: string
  accountHolder: string
  accountType: string
  accountNumber: string
  clabeIban: string | null
  accountAlias: string | null
  notes: string | null
  orderIndex: number
}
