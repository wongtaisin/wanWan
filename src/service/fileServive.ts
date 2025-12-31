class FilesService {
  addFile = `INSERT INTO sys_file (id, url, suffix, module, create_date) VALUES (?, ?, ?, ?, COALESCE(NULLIF(?, ''), now()))`
}

export default new FilesService()
