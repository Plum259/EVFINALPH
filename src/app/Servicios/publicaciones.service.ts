import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Publicacion } from '../home/home.page';

@Injectable({
  providedIn: 'root'
})
export class PublicacionesService {

  sqlite:SQLiteConnection = new SQLiteConnection(CapacitorSQLite)
  db!: SQLiteDBConnection;

  plataforma:string = ""

  DB_NAME:string = "lista_publicaciones";
  DB_ENCRIPTADA: boolean = false;
  DB_MODE: string = "no-encryption";
  DB_VERSION: number = 1;
  DB_READ_ONLY: boolean = false;
  TABLE_NAME = "lista_publicaciones"
  COL_TITU:string = "titulo"
  COL_DESC:string = "descripcion"
  COL_FECH:string = "fecha"
  COL_FOT:string = "foto"
  DB_SQL_TABLAS: string = `
    CREATE TABLE IF NOT EXISTS ${this.TABLE_NAME} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ${this.COL_TITU} TEXT NOT NULL,
      ${this.COL_DESC} TEXT NOT NULL,
      ${this.COL_FECH} TEXT NOT NULL,
      ${this.COL_FOT} TEXT NULL
    );
  `;
  constructor() { }

private async _iniciarPluginWeb(): Promise<void> {    
    await customElements.whenDefined('jeep-sqlite')
    const jeepSqliteEl = document.querySelector("jeep-sqlite")
    if( jeepSqliteEl != null ) {      
      await this.sqlite.initWebStore()            
    }
}
async iniciarPlugin() {    
  this.plataforma = Capacitor.getPlatform()
  if(this.plataforma == "web") {
    await this._iniciarPluginWeb()
  }
  await this.abrirConexion()
  await this.db.execute(this.DB_SQL_TABLAS)             
}
async abrirConexion() {                    
  const ret = await this.sqlite.checkConnectionsConsistency() 
  const isConn = (await this.sqlite.isConnection(this.DB_NAME, this.DB_READ_ONLY)).result
  if(ret.result && isConn) {
    this.db = await this.sqlite.retrieveConnection(this.DB_NAME, this.DB_READ_ONLY)      
  } else {
    this.db = await this.sqlite.createConnection(
      this.DB_NAME,
      this.DB_ENCRIPTADA,
      this.DB_MODE,
      this.DB_VERSION,
      this.DB_READ_ONLY
    )
  }
  await this.db.open()
}
async getPublicaciones():Promise<Publicacion[]> {    
  const sql = `SELECT * FROM ${this.TABLE_NAME}`      
  const resultado = await this.db.query(sql)
  return resultado?.values ?? []
}
async agregarPublicacion(p:Publicacion):Promise<void> {    
  const sql = `INSERT INTO ${this.TABLE_NAME}(${this.COL_TITU}, ${this.COL_DESC},${this.COL_FECH},${this.COL_FOT}) VALUES(?, ?, ?, ?)`
  await this.db.run(sql, [p.titulo,p.descripcion,p.fecha,p.foto])    
}
async eliminarPublicacion(id: number): Promise<void>{
  const sql = `DELETE FROM ${this.TABLE_NAME} WHERE id = ?`;
  await this.db.run(sql, [id])
}
}
