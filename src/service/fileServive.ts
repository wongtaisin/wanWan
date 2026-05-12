class FilesService {
  addFile = `INSERT INTO sys_file (id, url, suffix, module, create_date) VALUES (?, ?, ?, ?, COALESCE(NULLIF(?, ''), now()))`

  editFile = `UPDATE sys_file SET url = ?, suffix = ?, module = ?, create_date = COALESCE(NULLIF(?, ''), now()) WHERE id = ?`

  deleteFile = `DELETE FROM sys_file WHERE id = ?`
}

export default new FilesService()
