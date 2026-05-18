export const apiRequestAdapter = (api: any) => ({
  data: api.data.data,
})

export const apiResponseAdapter = (api: any) => ({
  ok: api.data.ok,
  code: api.data.code,
  message: api.data.message,
  trace_id: api.data.trace_id,
  data: api.data.data,
  errors: api.data.errors,
})