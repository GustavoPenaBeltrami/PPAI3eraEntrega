import { collection, doc, setDoc } from "firebase/firestore/lite";
import { FirebaseDB } from "../firebase/config";
import { obtenerDatos } from "./getDatos";

const getFechaHoraActual = () => {
    const fecha = new Date(); // Aquí se asume que ya tienes un objeto Date

    const dia = fecha.getDate().toString().padStart(2, '0'); // Obtener día con dos dígitos
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0'); // Obtener mes con dos dígitos (se suma 1 ya que los meses se cuentan desde 0)
    const año = fecha.getFullYear().toString(); // Obtener año

    const hora = fecha.getHours().toString().padStart(2, '0'); // Obtener hora con dos dígitos
    const minutos = fecha.getMinutes().toString().padStart(2, '0'); // Obtener minutos con dos dígitos
    const segundos = fecha.getSeconds().toString().padStart(2, '0'); // Obtener segundos con dos dígitos

    const fechaFormateada = `${dia}/${mes}/${año} ${hora}:${minutos}:${segundos}`;

    return fechaFormateada;
}

//Declaracion de clases
class Cliente {
    constructor(id, nombre, fechaNacimiento, hijos, codigoPostal) {
        this._id = String(id);
        this._nombre = nombre;
        this._fechaNacimiento = fechaNacimiento;
        this._hijos = hijos;
        this._codigoPostal = codigoPostal;
    }
    get id() {
        return this._id;
    }
    get nombre() {
        return this._nombre;
    }
    getNombre() {
        return this._nombre;
    }
    getDatos() {
        return Object.keys(this).reduce((atributos, key) => {
            if (key !== 'getDatos') {
                atributos[key] = this[key];
            }
            return atributos;
        }, {});
    }
    async subirAFirebase() {
        try {
            const clientesCollectionRef = collection(FirebaseDB, 'clientes');
            const clienteData = {
                id: this._id,
                nombre: this._nombre,
                fechaNacimiento: this._fechaNacimiento,
                hijos: this._hijos,
                codigoPostal: this._codigoPostal,
            };

            await setDoc(doc(clientesCollectionRef, this._id), clienteData);

            console.log('Cliente subido a Firebase con ID:', this._id);
            return this._id; // Devolver el ID del documento creado en Firebase
        } catch (error) {
            console.error('Error al subir el cliente a Firebase:', error);
            throw error;
        }
    }
    set nombre(nuevoNombre) {
        this._nombre = nuevoNombre;
    }
}
class OpcionValidacion {
    constructor(id, nombre, esCorrecta) {
        this._id = String(id);
        this._nombre = nombre;
        this._esCorrecta = esCorrecta;
    }
    get id() {
        return this._id;
    }
    get nombre() {
        return this._nombre;
    }
    getDatos() {
        return Object.keys(this).reduce((atributos, key) => {
            if (key !== 'getDatos') {
                atributos[key] = this[key];
            }
            return atributos;
        }, {});
    }
    set nombre(nuevoNombre) {
        this._nombre = nuevoNombre;
    }
    esMiOpcion(respuesta) {
        //respuesta es un string
        if (this._nombre === respuesta) {
            return this
        } else {
            return null
        }
    }
    esOpcionCorrecta() {
        //Valida si esCorrecta es true o false pero se devuelve a sí mismo
        if (this._esCorrecta) {
            return this
        } else {
            return null
        }
    }
    async subirAFirebase() {
        try {
            const collectionRef = collection(FirebaseDB, 'opcionvalidaciones');

            await setDoc(doc(collectionRef, this._id), {
                nombre: this._nombre,
                esCorrecta: this._esCorrecta,
            });

            console.log('Doc subido a Firebase con ID:', this._id);
            return this._id; // Devolver el ID del documento creado en Firebase
        } catch (error) {
            console.error('Error al subir el cliente a Firebase:', error);
            throw error;
        }
    }
}
class Accion {
    constructor(id, descripcion) {
        this._id = String(id);
        this._descripcion = descripcion;
    }
    get id() {
        return this._id;
    }
    get descripcion() {
        return this._descripcion;
    }
    getDatos() {
        return Object.keys(this).reduce((atributos, key) => {
            if (key !== 'getDatos') {
                atributos[key] = this[key];
            }
            return atributos;
        }, {});
    }
    set descripcion(nuevaDescripcion) {
        this._descripcion = nuevaDescripcion;
    }
    async subirAFirebase() {
        try {
            const collectionRef = collection(FirebaseDB, 'acciones');

            await setDoc(doc(collectionRef, this._id), {
                descripcion: this._descripcion,
            });

            console.log(' subido a Firebase con ID:', this._id);
            return this._id; // Devolver el ID del documento creado en Firebase
        } catch (error) {
            console.error('Error al subir el  a Firebase:', error);
            throw error;
        }
    }
}
class Validacion {
    constructor(id, nombre, opcionValidacion) {
        this._id = String(id);
        this._nombre = nombre;
        this._opcionValidacion = opcionValidacion;
    }
    get id() {
        return this._id;
    }
    get nombre() {
        return this._nombre;
    }
    getNombre() {
        return this._nombre;
    }
    get opcionValidacion() {
        return this._opcionValidacion;
    }
    getDatos() {
        return Object.keys(this).reduce((atributos, key) => {
            if (key !== 'getDatos') {
                atributos[key] = this[key];
            }
            return atributos;
        }, {});
    }
    set nombre(nuevoNombre) {
        this._nombre = nuevoNombre;
    }
    set opcionValidacion(nuevaOpcionValidacion) {
        this._opcionValidacion = nuevaOpcionValidacion;
    }
    buscarOpciones(respuesta) {
        for (const opcion of this._opcionValidacion) {
            if (opcion.esMiOpcion(respuesta)) {
                return opcion
            }
        }
        return null
    }
    buscarOpcionCorrecta() {
        for (const opcion of this._opcionValidacion) {
            if (opcion.esOpcionCorrecta()) {
                return opcion
            }
        }
        return null
    }
    validarRespuesta(correcta, respuesta) {
        if (correcta === respuesta) {
            return true
        } else {
            return false
        }
    }
    esValidacion(miValidacion) {
        if (miValidacion === this) {
            this.getNombre();
            return true
        }
        return false
    }
    async subirAFirebase() {
        try {
            const collectionRef = collection(FirebaseDB, 'validaciones');
            const collectionOpcionesRef = collection(FirebaseDB, 'opcionvalidaciones');
            const opcionRefs = this._opcionValidacion.map(opcion => doc(collectionOpcionesRef, opcion.id)); // Convertimos a referencias

            await setDoc(doc(collectionRef, this._id), {
                nombre: this._nombre,
                opciones: opcionRefs,
            });

            console.log('Validación subida a Firebase con ID:', this._id);
            return this._id; // Devolver el ID del documento creado en Firebase
        } catch (error) {
            console.error('Error al subir la validación a Firebase:', error);
            throw error;
        }
    }
}
class SubOpcionLlamada {
    constructor(id, nombre, validacion = null) {
        this._id = String(id);
        this._nombre = nombre;
        this._validacion = validacion;
    }
    get id() {
        return this._id;
    }
    get nombre() {
        return this._nombre;
    }
    getNombre() {
        return this._nombre;
    }
    get validacion() {
        return this._validacion;
    }
    getDatos() {
        return Object.keys(this).reduce((atributos, key) => {
            if (key !== 'getDatos') {
                atributos[key] = this[key];
            }
            return atributos;
        }, {});
    }
    set nombre(nuevoNombre) {
        this._nombre = nuevoNombre;
    }
    set validacion(nuevaValidacion) {
        this._validacion = nuevaValidacion;
    }
    obtenerValidacion() {
        this.getNombre() //Es para dejar en claro en el diagrama que obtenemos el puntero en memoria
        const validacionesIdentificadas = []
        //comienza el loop del * en "esValidacion()", el metodo de la clase validacion
        for (const miValidacion of this._validacion) {
            for (const validacion of validaciones) {
                if (validacion.esValidacion(miValidacion)) {
                    validacionesIdentificadas.push(miValidacion)
                }
            }
        }

        return {
            subopcionIdentificada: this,
            validacionIdentificada: validacionesIdentificadas
        }
    }
    async subirAFirebase() {
        try {
            const collectionRef = collection(FirebaseDB, 'subopciones');
            const collectionValidacionesRef = collection(FirebaseDB, 'validaciones');
            let validacionRefs = null;

            if (this._validacion && this._validacion.length > 0) {
                validacionRefs = this._validacion.map(opcion => doc(collectionValidacionesRef, opcion.id)); // Convertimos a referencias
            }

            await setDoc(doc(collectionRef, this._id), {
                nombre: this._nombre,
                validaciones: validacionRefs,
            });

            console.log('Validación subida a Firebase con ID:', this._id);
            return this._id; // Devolver el ID del documento creado en Firebase
        } catch (error) {
            console.error('Error al subir la validación a Firebase:', error);
            throw error;
        }
    }
}
class OpcionLlamada {
    constructor(id, nombre, subOpcionLlamada = null, validacion = null) {
        this._id = String(id);
        this._nombre = nombre;

        if (subOpcionLlamada !== null && subOpcionLlamada !== undefined) {
            this._subOpcionLlamada = Array.isArray(subOpcionLlamada) ? subOpcionLlamada : [subOpcionLlamada];

            const validaciones = this._subOpcionLlamada
                .filter(subOpcion => subOpcion && Array.isArray(subOpcion._validacion))
                .flatMap(subOpcion => subOpcion._validacion);

            this._validacion = validaciones.length > 0 ? validaciones : validacion;
        } else {
            this._subOpcionLlamada = null;
            this._validacion = null;
        }
    }
    get id() {
        return this._id;
    }
    get nombre() {
        return this._nombre;
    }
    getNombre() {
        return this._nombre;
    }
    get subOpcionLlamada() {
        return this._subOpcionLlamada;
    }
    get validacion() {
        return this._validacion;
    }
    getDatos() {
        return Object.keys(this).reduce((atributos, key) => {
            if (key !== 'getDatos') {
                atributos[key] = this[key];
            }
            return atributos;
        }, {});
    }
    set nombre(nuevoNombre) {
        this._nombre = nuevoNombre;
    }
    set validacion(nuevaValidacion) {
        this._validacion = nuevaValidacion;
    }
    set subOpcionLlamada(nuevaSubOpcionLlamada) {
        this._subOpcionLlamada = nuevaSubOpcionLlamada;
    }
    obtenerCategoria(categorias) {
        this.getNombre() //Es para dejar en claro en el diagrama que obtenemos el puntero en memoria

        //comienza el loop del * en "esCategoria()", el metodo de la clase categoria
        //que retorna la categoria que cumpla la condicion de corte
        for (const categoria of categorias) {
            const categoriaPertenece = categoria.esCategoria(this); //En caso de encontrarlo retorna el puntero, sino null
            if (categoriaPertenece) {
                return {
                    categoriaIdentificada: categoriaPertenece, //
                    opcionIdentificada: this //Pero para javascript el puntero se obtiene del objeto completo
                };
            }
        }

        return null; // No se encontró una categoría para la opción
    }
    async subirAFirebase() {
        try {
            const collectionRef = collection(FirebaseDB, 'opciones');
            const collectionValidacionesRef = collection(FirebaseDB, 'validaciones');
            let validacionRefs = null;
            const collectionSubOpcionesRef = collection(FirebaseDB, 'subopciones');
            let subopcionesRef = null;

            if (this._validacion && this._validacion.length > 0) {
                validacionRefs = this._validacion.map(opcion => doc(collectionValidacionesRef, opcion.id)); // Convertimos a referencias
            }
            if (this._subOpcionLlamada && this._subOpcionLlamada.length > 0) {
                subopcionesRef = this._subOpcionLlamada.map(opcion => doc(collectionSubOpcionesRef, opcion.id)); // Convertimos a referencias
            }

            await setDoc(doc(collectionRef, this._id), {
                nombre: this._nombre,
                subopciones: subopcionesRef,
                validaciones: validacionRefs,
            });

            console.log('Validación subida a Firebase con ID:', this._id);
            return this._id; // Devolver el ID del documento creado en Firebase
        } catch (error) {
            console.error('Error al subir la validación a Firebase:', error);
            throw error;
        }
    }
}
class CategoriaLlamada {
    constructor(id, nombre, opcionLlamada = null) {
        this._id = String(id);
        this._nombre = nombre;
        this._opcionesLlamada = opcionLlamada;
    }
    get id() {
        return this._id;
    }
    get nombre() {
        return this._nombre;
    }
    getNombre() {
        return this._nombre;
    }

    get opcionesLlamada() {
        return this._opcionesLlamada;
    }

    getDatos() {
        return Object.keys(this).reduce((atributos, key) => {
            if (key !== 'getDatos') {
                atributos[key] = this[key];
            }
            return atributos;
        }, {});
    }

    set nombre(nuevoNombre) {
        this._nombre = nuevoNombre;
    }

    set opcionesLlamada(nuevaOpcionLlamada) {
        this._opcionesLlamada.push(nuevaOpcionLlamada);
    }

    agregarOpcionLlamada(opcionLlamada) {
        this._opcionLlamada.push(opcionLlamada);
    }

    esCategoria(opcion) {
        for (const opcionLlamada of this._opcionesLlamada) {
            if (opcionLlamada.nombre === opcion.nombre) {
                this.getNombre() // Lo mismo que antes, en el diagrama con esto es suficiente pero en javascript necesito el objeto entero
                return this; //el objeto entero en sí
            }
        }
        return null;
    }
    async subirAFirebase() {
        try {
            const collectionRef = collection(FirebaseDB, 'categorias');
            const opcionesRef = collection(FirebaseDB, 'opciones');
            let opciones = null;

            if (this._opcionesLlamada && this._opcionesLlamada.length > 0) {
                opciones = this._opcionesLlamada.map(opcion => doc(opcionesRef, opcion.id)); // Convertimos a referencias
            }

            await setDoc(doc(collectionRef, this._id), {
                nombre: this._nombre,
                opcionesLlamada: opciones,
            });

            console.log('Categoria subida a Firebase con ID:', this._id);
            return this._id; // Devolver el ID del documento creado en Firebase
        } catch (error) {
            console.error('Error al subir la validación a Firebase:', error);
            throw error;
        }
    }
}
class Estado {
    constructor(id, nombre) {
        if (this.constructor === Estado) {
            throw new Error('No puedes instanciar una clase abstracta directamente.');
        }
        this._id = String(id);
        this._nombre = nombre;
    }
    get id() {
        return this._id;
    }
    get nombre() {
        return this._nombre;
    }
    getDatos() {
        return Object.keys(this).reduce((atributos, key) => {
            if (key !== 'getDatos') {
                atributos[key] = this[key];
            }
            return atributos;
        }, {});
    }
    actualizarCELlamada(fecha, llamada, cambioEstadoDeLlamada) {
        //Busca el ultimo estado actual
        const ultimoCambioEstado = this.buscarCEActual(cambioEstadoDeLlamada)
        ultimoCambioEstado.fechaHoraFin = fecha
        //Crea el proximo estado
        const proximoEstado = this.crearProximoEstado('EnCurso') //Va en curso porque si viene de iniciada al operador es porque va a estar en curso hasta que el cliente cuelgue o se finalice.
        //Crear el proximo cambio de estado
        this.crearCambioEstadoLlamada(llamada, proximoEstado, fecha)
    }
    buscarCEActual(cambioEstadoDeLlamada) {
        //Recorro los cambios de estado el que me develve true es:

        for (const cambioEstado of cambioEstadoDeLlamada) {
            if (cambioEstado.esCambioDeEstadoActual()) {
                return cambioEstado
            } 
        }

        throw Error('Error no hay estados')
    }
    crearCambioEstadoLlamada(llamada, proxEstado, fecha) {

        const maxID = llamada._cambioEstado.reduce((maxInstancia, instancia) => {
            return instancia._id > (maxInstancia ? maxInstancia._id : 0) ? instancia : maxInstancia;
        }, null);
        const newID = maxID ? Number(maxID._id) + 1 : 1;
        const nuevoCambioEstado = new CambioEstado(newID, proxEstado)

        nuevoCambioEstado.fechaHoraInicio = fecha

        llamada.agregarCE(nuevoCambioEstado)
    }
    crearProximoEstado(nombre) {
        if (nombre === "Iniciada") {
            return new Iniciada()
        }
        if (nombre === "EnCurso") {
            return new EnCurso()
        }
        if (nombre === "Finalizada") {
            return new Finalizada()
        }
        if (nombre === "Colgada") {
            return new Colgada()
        }
    }
    async subirAFirebase() {
        try {
            const collectionRef = collection(FirebaseDB, 'estados');

            await setDoc(doc(collectionRef, this._id), {
                nombre: this._nombre,
            });

            console.log('Doc subido a Firebase con ID:', this._id);
            return this._id; // Devolver el ID del documento creado en Firebase
        } catch (error) {
            console.error('Error al subir el cliente a Firebase:', error);
            throw error;
        }
    }
}
class Iniciada extends Estado {
    constructor() {
        super(1, "Iniciada")
    }
    actualizarCELlamada(fecha, llamada, cambioEstadoDeLlamada, proxEstado = null) {
        //Busca el ultimo estado actual
        const ultimoCambioEstado = this.buscarCEActual(cambioEstadoDeLlamada)
        ultimoCambioEstado.fechaHoraFin = fecha
        //Crea el proximo estado
        const proximoEstado = this.crearProximoEstado('EnCurso') //Va en curso porque si viene de iniciada al operador es porque va a estar en curso hasta que el cliente cuelgue o se finalice.
        //Crear el proximo cambio de estado
        const nuevoCambioEstado = this.crearCambioEstadoLlamada(llamada, proximoEstado, fecha)
    }
    async subirAFirebase() {
        try {
            const collectionRef = collection(FirebaseDB, 'iniciada');

            await setDoc(doc(collectionRef, this._id), {
                nombre: this._nombre,
            });

            console.log('Doc subido a Firebase con ID:', this._id);
            return this._id; // Devolver el ID del documento creado en Firebase
        } catch (error) {
            console.error('Error al subir el cliente a Firebase:', error);
            throw error;
        }
    }
}
class EnCurso extends Estado {
    constructor() {
        super(1, "EnCurso")
    }
    actualizarCELlamada(fecha, llamada, cambioEstadoDeLlamada, proxEstado) {
        //Busca el ultimo estado actual
        const ultimoCambioEstado = this.buscarCEActual(cambioEstadoDeLlamada)
        ultimoCambioEstado.fechaHoraFin = fecha

        //Crea el proximo estado

        const proximoEstado = this.crearProximoEstado(proxEstado) //Va en curso porque si viene de iniciada al operador es porque va a estar en curso hasta que el cliente cuelgue o se finalice.
        //Crear el proximo cambio de estado
        const nuevoCambioEstado = this.crearCambioEstadoLlamada(llamada, proximoEstado, fecha)
    }
    async subirAFirebase() {
        try {
            const collectionRef = collection(FirebaseDB, 'encurso');

            await setDoc(doc(collectionRef, this._id), {
                nombre: this._nombre,
            });

            console.log('Doc subido a Firebase con ID:', this._id);
            return this._id; // Devolver el ID del documento creado en Firebase
        } catch (error) {
            console.error('Error al subir el cliente a Firebase:', error);
            throw error;
        }
    }
}
class Finalizada extends Estado {
    constructor() {
        super(1, "Finalizada")
    }

    async subirAFirebase() {
        try {
            const collectionRef = collection(FirebaseDB, 'finalizada');

            await setDoc(doc(collectionRef, this._id), {
                nombre: this._nombre,
            });

            console.log('Doc subido a Firebase con ID:', this._id);
            return this._id; // Devolver el ID del documento creado en Firebase
        } catch (error) {
            console.error('Error al subir el cliente a Firebase:', error);
            throw error;
        }
    }
}
class Colgada extends Estado {
    constructor() {
        super(1, "Colgada")
    }

    async subirAFirebase() {
        try {
            const collectionRef = collection(FirebaseDB, 'colgada');

            await setDoc(doc(collectionRef, this._id), {
                nombre: this._nombre,
            });

            console.log('Doc subido a Firebase con ID:', this._id);
            return this._id; // Devolver el ID del documento creado en Firebase
        } catch (error) {
            console.error('Error al subir el cliente a Firebase:', error);
            throw error;
        }
    }
}
class CambioEstado {
    constructor(id, estado, fechaHoraInicio = null, fechaHoraFin = null) {
        this._id = String(id);
        this._estado = estado;
        this._fechaHoraInicio = fechaHoraInicio
        this._fechaHoraFin = fechaHoraFin
    }
    get id() {
        return this._id;
    }
    get estado() {
        return this._estado;
    }
    get fechaHoraInicio() {
        return this._fechaHoraInicio;
    }
    get fechaHoraFin() {
        return this._fechaHoraFin;
    }
    getDatos() {
        return Object.keys(this).reduce((atributos, key) => {
            if (key !== 'getDatos') {
                atributos[key] = this[key];
            }
            return atributos;
        }, {});
    }
    set estado(nuevoEstado) {
        this._estado = nuevoEstado;
    }
    set fechaHoraInicio(nuevaFechaHoraInicio) {
        this._fechaHoraInicio = nuevaFechaHoraInicio;
    }
    set fechaHoraFin(nuevaFechaHoraFin) {
        this._fechaHoraFin = nuevaFechaHoraFin;
    }
    esCambioDeEstadoActual() {
        return this._fechaHoraFin === null;
    }
    async subirAFirebase() {
        try {
            const collectionRef = collection(FirebaseDB, 'cambioestados');
            const estadosRef = collection(FirebaseDB, 'estados');

            const estado = doc(estadosRef, this._estado.id);


            await setDoc(doc(collectionRef, this._id), {
                estado: estado,
                fechaHoraInicio: this._fechaHoraInicio,
                fechaHoraFin: this._fechaHoraFin
            });

            console.log('Categoria subida a Firebase con ID:', this._id);
            return this._id; // Devolver el ID del documento creado en Firebase
        } catch (error) {
            console.error('Error al subir la validación a Firebase:', error);
            throw error;
        }
    }
}
class Llamada {
    constructor(id, cliente, cambioEstado, opcionLlamada = null, subOpcionLlamada = null, fechaHoraInicio = null, accion = null, duracion = null, descripcionOperador = null, fechaHoraFin = null) {
        this._id = String(id);
        this._cliente = cliente;
        this._cambioEstado = cambioEstado;
        this._opcionLlamada = opcionLlamada;
        this._subOpcionLlamada = subOpcionLlamada;
        this._fechaHoraInicio = fechaHoraInicio;
        this._accion = accion;
        this._duracion = duracion
        this._descripcionOperador = descripcionOperador
        this._fechaHoraFin = fechaHoraFin;
    }
    get id() {
        return this._id;
    }
    get subOpcionLlamada() {
        return this._subOpcionLlamada
    }
    get descripcionOperador() {
        return this._descripcionOperador
    }
    get duracion() {
        return this._duracion
    }
    get opcionLlamada() {
        return this._opcionLlamada
    }
    get fechaHoraFin() {
        return this._fechaHoraFin
    }
    set subOpcionLlamada(nuevaSubOpcionLlamada) {
        this._subOpcionLlamada = nuevaSubOpcionLlamada;
    }
    set descripcionOperador(nuevaDescripcionOperador) {
        this._descripcionOperador = nuevaDescripcionOperador;
    }
    set fechaHoraFin(arg) {
        this._fechaHoraFin = arg
    }
    set opcionLlamada(nuevaOopcionLlamada) {
        this._opcionLlamada = nuevaOopcionLlamada
    }
    getDatos() {
        return Object.keys(this).reduce((atributos, key) => {
            if (key !== 'getDatos') {
                atributos[key] = this[key];
            }
            return atributos;
        }, {});
    }
    calcularDuracion() {
        var fechaI = this._fechaHoraInicio;
        var fechaIformateada = fechaI.replace(/(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2})/, "$3-$2-$1T$4:$5:$6");
        var fechaIdate = new Date(fechaIformateada);

        var fechaF = getFechaHoraActual()
        this._fechaHoraFin = fechaF
        var fechaFformateada = fechaF.replace(/(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2})/, "$3-$2-$1T$4:$5:$6");
        var fechaFdate = new Date(fechaFformateada);


        let diferencia = fechaFdate.getTime() - fechaIdate.getTime();
        let segundos = Math.floor(diferencia / 1000) % 60;
        let minutos = Math.floor(diferencia / 1000 / 60) % 60;
        let horas = Math.floor(diferencia / 1000 / 60 / 60);
        this._duracion = horas + ":" + minutos + ":" + segundos;
        return this._duracion;
    }
    actualizarCELlamada(fecha = null, proxEstado = null) {
        const estadoActual = this._cambioEstado[this._cambioEstado.length - 1]._estado
        estadoActual.actualizarCELlamada(fecha, this, this._cambioEstado, proxEstado)
    }
    agregarCE(cambioEstado) {
        this._cambioEstado.push(cambioEstado)
        console.log(this)
    }
    obtenerNombreClienteDeLlamada() {
        //dispara el metodo getNombre() de la clase cliente
        return this._cliente.getNombre()
    }
    obtenerSubOpcionSeleccionada() {
        const { subopcionIdentificada, validacionIdentificada } = this._subOpcionLlamada.obtenerValidacion()

        return {
            subopcionIdentificada,
            validacionIdentificada
        }

    }
    obtenerOpcionYCategoria() {
        //disparo el metodo de opcionLlamada, obtenerCategoria, que me devuele tanto la opcion y la categoria
        const { opcionIdentificada, categoriaIdentificada } = this._opcionLlamada.obtenerCategoria(categorias)
        return {
            opcionIdentificada,
            categoriaIdentificada
        }
    }
    async subirAFirebase() {
        try {
            const collectionRef = collection(FirebaseDB, 'llamadas');
            const clientesCollectionRef = collection(FirebaseDB, 'clientes');
            const cambioEstadosCollectionRef = collection(FirebaseDB, 'cambioestados');
            const opcionLlamadaCollectionRef = collection(FirebaseDB, 'opciones');
            const subOpcionesLlamadasCollectionRef = collection(FirebaseDB, 'subopciones');
            const accionCollectionRef = collection(FirebaseDB, 'acciones');

            let cliente = null;
            let cambioEstado = null;
            let opcion = null;
            let subOpcion = null;
            let accion = null;

            cliente = doc(clientesCollectionRef, this._cliente.id);
            opcion = doc(opcionLlamadaCollectionRef, this._opcionLlamada.id);
            subOpcion = doc(subOpcionesLlamadasCollectionRef, this._opcionLlamada.id);

            if (this._accion) {
                accion = doc(accionCollectionRef, this._accion.id);
            }

            if (this._cambioEstado && this._cambioEstado.length > 0) {
                cambioEstado = this._cambioEstado.map(cambioEstado => doc(cambioEstadosCollectionRef, cambioEstado.id));
            }

            await setDoc(doc(collectionRef, this._id), {
                cliente: cliente,
                cambioEstado: cambioEstado,
                opcionLlamada: opcion,
                subOpcionLlamada: subOpcion,
                fechaHoraInicio: this._fechaHoraInicio,
                accion: accion,
                duracion: this._duracion,
                descripcionOperador: this._descripcionOperador,
                fechaHoraFin: this._fechaHoraFin
            });

            console.log('Categoria subida a Firebase con ID:', this._id);
            return this._id; // Devolver el ID del documento creado en Firebase
        } catch (error) {
            console.error('Error al subir la validación a Firebase:', error);
            throw error;
        }
    }
}

class GestorLlamada {
    constructor() {
        this._acciones = [];
        this._accionSeleccionada = null;
        this._categoriaLlamada = null;
        this._descripcionOperador = "";
        this._estadoEnCurso = null;
        this._estadoFinalizado = null;
        this._estadoColgada = null
        this._fechaHoraActual = null;
        this._llamada = null;
        this._nombreCliente = null;
        this._respuestaCliente = [];
        this._opcionLlamada = null;
        this._subOpcionLlamada = null;
        this._confirmacion = null;
        this._validaciones = null;
        this._validacionesCorrectas = []
    }
    get llamada() {
        return this._llamada
    }
    get cliente() {
        return this._nombreCliente
    }
    get categoria() {
        return this._categoriaLlamada
    }
    get opcion() {
        return this._opcionLlamada
    }
    get subopcion() {
        return this._subOpcionLlamada
    }
    get validaciones() {
        return this._validaciones
    }
    get descripcionOperador() {
        return this._descripcionOperador
    }
    get acciones() {
        return this._acciones
    }
    set llamada(nuevaLlamada) {
        this._llamada = nuevaLlamada
    }

    //Metodos
    opcionComunicarseOperador() {
        //Busca la llamada en el CU1 y le cambia el estado a "enCurso"
        this.llamarCURegistrarLlamada();

        this.obtenerDatosDeLlamada()
    }
    llamarCURegistrarLlamada() {
        // Simula que el caso de uso 1 le envia una llamada, pero en realidad usa una llamda que creamos nosotros que cumpla las condiciones
        this._llamada = llamadas[2];
        //Llama ActualizarCELlamada()
        this.actualizarCELlamada()
    };
    actualizarCELlamada(proxEstado) {
        //Obtengo fecha actual
        this.obtenerFechaYHoraActual()

        //Delego a la llamada la actualizacion del CE
        this._llamada.actualizarCELlamada(this._fechaHoraActual,proxEstado)

    }
    obtenerFechaYHoraActual() {
        this._fechaHoraActual = getFechaHoraActual();
    };
    obtenerDatosDeLlamada() {
        //Le pido a la clase llamada que le pregunte a su cliente cual es su nombre y lo almaceno en mi atributo
        //En este caso el atributo solo se llama nombreCliente, por ende se guarda el nombre nomas, en caso de querer el cliente
        //comleto desde el gestor no puedo ir directamente, tendria que recorrer todas las intancais de cliente (solamente en Javascript,
        //en el diagrama con eso es suficiente para entender).


        this._nombreCliente = this._llamada.obtenerNombreClienteDeLlamada();

        //Le pido a la clase llamada que le pregunte a su opcion cual es su categoria y almaceno el puntero
        //de la opcion y el puntero de la categoria

        const { opcionIdentificada, categoriaIdentificada } = this._llamada.obtenerOpcionYCategoria()
        this._opcionLlamada = opcionIdentificada
        this._categoriaLlamada = categoriaIdentificada

        //Obtengo la subOpcion seleccionada y sus validaciones(1 como minimo).


        const { subopcionIdentificada, validacionIdentificada } = this._llamada.obtenerSubOpcionSeleccionada()
        this._subOpcionLlamada = subopcionIdentificada;
        this._validaciones = validacionIdentificada;

        //revisar
        // for (const opciones of validacionIdentificada) {
        //     for (const respuestas of opciones._opcionValidacion) {
        //         if (respuestas._esCorrecta){
        //             this._validacionesCorrectas.push(respuestas)

        //         }
        //     }
        // }   
        //

        //le pongo por cada validacion que encuentre, un false en el array de respuestas correctas, al contestar bien les mando true!
        for (const index of validacionIdentificada) {
            this._validacionesCorrectas.push(false)
            
        }

    };
    tomarRespuesta(respuesta, id) {
        this._respuestaCliente[id] = respuesta
        this.validarRespuesta(respuesta, id)
    };
    validarRespuesta(respuesta, id) {
        //validacion = la que seleccioné
        //correcta = la que tiene _esCorrecta en true

        const validacion = this._validaciones[id].buscarOpciones(respuesta)
        if (validacion) {
            this._respuestaCliente[id] = validacion;
        }
        const correcta = this._validaciones[id].buscarOpcionCorrecta()

        this._validaciones[id].validarRespuesta(correcta, validacion)


    };
    tomarDescripcion(descripcion) {
        this._descripcionOperador = descripcion;
        return this._descripcionOperador
    };
    obtenerAccionesARealizar() {
        this._acciones = []
        for (const accion of acciones) {
            //Esto equivale a un *obtenerAcciones() ya que obtengo toda la accion de forma interna de las clases de javascript y se almacena en el iterador "accion"
            //y simplemente lo almaceno en mi atributo acciones del gestor
            this._acciones.push(accion)
        }
    };
    tomarSeleccionAccion(accionSeleccionada, acciones) {
        for (const accion of acciones) {
            if (accionSeleccionada == accion._descripcion) {
                this._accionSeleccionada = accion
            }
        }
    };
    tomarConfirmacion() {
        this._confirmacion = true
    };
    finalizarLlamada() {
        this._llamada.descripcionOperador = this._descripcionOperador;
        this._llamada.calcularDuracion();
        this._llamada.opcionLlamada = this._opcionLlamada;
        this._llamada.subOpcionLlamada = this._subOpcionLlamada;
        this._llamada._accion = this._accionSeleccionada;

        this.actualizarCELlamada('Finalizada')
        // this._llamada.crearCambioEstado(this._estadoFinalizado, this._fechaHoraActual)

    };
    llamadaColgada() {
        this._llamada.descripcionOperador = this._descripcionOperador;
        this._llamada.calcularDuracion();
        this._llamada.opcionLlamada = this._opcionLlamada;
        this._llamada.subOpcionLlamada = this._subOpcionLlamada;
        this._llamada._accion = this._accionSeleccionada;

        this.actualizarCELlamada('Colgada')
        // this._llamada.crearCambioEstado(this._estadoFinalizado, this._fechaHoraActual)

    }

    getDatos() {
        return Object.keys(this).reduce((atributos, key) => {
            if (key !== 'getDatos') {
                atributos[key] = this[key];
            }
            return atributos;
        }, {});
    };
    setearInfo() {
        this._acciones = [];
        this._accionSeleccionada = null;
        this._categoriaLlamada = null;
        this._descripcionOperador = "";
        this._estadoEnCurso = null;
        this._estadoFinalizado = null;
        this._fechaHoraActual = null;
        this._llamada = null;
        this._nombreCliente = null;
        this._respuestaCliente = [];
        this._opcionLlamada = null;
        this._subOpcionLlamada = null;
        this._confirmacion = null;
        this._validaciones = null;
        this._validacionesCorrectas = []
    }
}



const cliente1 = new Cliente(94499446, "Gustavo Peña Beltrami", "19/12/1999", "0", "12345");
const cliente2 = new Cliente(42576142, "María López García", "05/07/1985", "2", "54321");
const cliente3 = new Cliente(41987622, "Carlos Rodríguez Pérez", "10/02/1978", "3", "98765");

const clientes = [cliente1, cliente2, cliente3];


const opcionValidacion1 = new OpcionValidacion(1, "0", false);
const opcionValidacion2 = new OpcionValidacion(2, "2", true);
const opcionValidacion3 = new OpcionValidacion(3, "3", false);
const opcionValidacion4 = new OpcionValidacion(4, "54321", true);
const opcionValidacion5 = new OpcionValidacion(5, "98765", false);
const opcionValidacion6 = new OpcionValidacion(6, "23456", false);
const opcionValidacion7 = new OpcionValidacion(7, "22/04/1997", false);
const opcionValidacion8 = new OpcionValidacion(8, "19/12/1999", false);
const opcionValidacion9 = new OpcionValidacion(9, "05/07/1985", true);
const opcionValidacion10 = new OpcionValidacion(10, "12/2026", false);
const opcionValidacion11 = new OpcionValidacion(11, "07/2025", true);
const opcionValidacion12 = new OpcionValidacion(12, "02/2027", false);

const opcionesValidacion = [
    opcionValidacion1,
    opcionValidacion2,
    opcionValidacion3,
    opcionValidacion4,
    opcionValidacion5,
    opcionValidacion6,
    opcionValidacion7,
    opcionValidacion8,
    opcionValidacion9,
    opcionValidacion10,
    opcionValidacion11,
    opcionValidacion12
]


const accion1 = new Accion(1, "Anular ultimo pago");
const accion2 = new Accion(2, "Anular Tarjeta");
const accion3 = new Accion(3, "Desbloquear Tarjeta");
const accion4 = new Accion(4, "Bloquear Tarjeta");
const accion5 = new Accion(5, "Dar de baja servicio");
const accion6 = new Accion(6, "Solicitar nueva tarjeta");

const acciones = [accion1, accion2, accion3, accion4, accion5, accion6];


const validacion1 = new Validacion(1, "Cantidad de hijos", [opcionValidacion1, opcionValidacion2, opcionValidacion3]);
const validacion2 = new Validacion(2, "Codigo Postal", [opcionValidacion4, opcionValidacion5, opcionValidacion6]);
const validacion4 = new Validacion(3, "Fecha de Nacimiento", [opcionValidacion7, opcionValidacion8, opcionValidacion9]);
const validacion3 = new Validacion(4, "Fecha Vencimiento de la tarjeta", [opcionValidacion10, opcionValidacion11, opcionValidacion12]);

const validaciones = [validacion1, validacion2, validacion3, validacion4]


const subOpcion1 = new SubOpcionLlamada(1, "Tiene los datos de la tarjeta", [validacion4]);
const subOpcion2 = new SubOpcionLlamada(2, "No tiene los datos de la tarjeta", [validacion1, validacion2, validacion3]);
const subOpcion3 = new SubOpcionLlamada(3, "Finalizar llamada");
const subOpcion4 = new SubOpcionLlamada(4, "Comunicarse con un operador", [validacion1, validacion3]);

const subOpciones = [subOpcion1, subOpcion2, subOpcion3, subOpcion4];


const opcion1 = new OpcionLlamada(1, "solicitar tarjeta nueva", [subOpcion4]);
const opcion2 = new OpcionLlamada(2, "Anular tarjeta", [subOpcion1, subOpcion2, subOpcion4, subOpcion3,]);
const opcion3 = new OpcionLlamada(3, "desbloquear tarjeta", [subOpcion1, subOpcion2, subOpcion4, subOpcion3,]);
const opcion4 = new OpcionLlamada(4, "dar de bajo servicio", [subOpcion1, subOpcion2, subOpcion4, subOpcion3,]);
const opcion5 = new OpcionLlamada(5, "finalizar llamada");

const opciones = [opcion1, opcion2, opcion3, opcion4, opcion5];


const categoria1 = new CategoriaLlamada(1, "Informar un robo", [opcion1, opcion2, opcion5]);
const categoria2 = new CategoriaLlamada(2, "Tarjeta bloqueda", [opcion1, opcion2, opcion3, opcion4, opcion5]);
const categoria3 = new CategoriaLlamada(3, "Tarjeta extraviada", [opcion1, opcion2, opcion4, opcion5]);
const categoria4 = new CategoriaLlamada(4, "Tarjeta utilizada sin consentimiento", [opcion2, opcion4, opcion5]);
const categoria5 = new CategoriaLlamada(5, "Alta de tarjeta", [opcion1, opcion5]);
const categoria6 = new CategoriaLlamada(6, "Finalizar llamada", [opcion5]);

const categorias = [categoria1, categoria2, categoria3, categoria4, categoria5, categoria6];


const estado1 = new Iniciada();
const estado2 = new EnCurso();
const estado3 = new Finalizada();
const estado4 = new Colgada();

const estados = [estado1, estado2, estado3, estado4];


const cambioEstado1 = new CambioEstado(1, estado1, "23/11/2023 15:23", "23/11/2023 15:23");
const cambioEstado2 = new CambioEstado(2, estado2, "23/11/2023 15:23");
const cambioEstado3 = new CambioEstado(3, estado1, "23/11/2023 11:47", "23/11/2023 11:47");
const cambioEstado4 = new CambioEstado(4, estado2, "23/11/2023 11:47", "23/11/2023 11:53");
const cambioEstado5 = new CambioEstado(5, estado3, "23/11/2023 11:53");
const cambioEstado6 = new CambioEstado(6, estado1, "23/11/2023 16:15:11");

const cambiosDeEstado = [
    cambioEstado1,
    cambioEstado2,
    cambioEstado3,
    cambioEstado4,
    cambioEstado5,
    cambioEstado6]


const llamada1 = new Llamada(1, cliente3, [cambioEstado4, cambioEstado5, cambioEstado6], opcion4, subOpcion3, "23/11/2023 11:53", accion3, '05:20', 'Dio de baja el servicio por temas financieros', '23/11/2023 12:04');
const llamada2 = new Llamada(2, cliente1, [cambioEstado1, cambioEstado2, cambioEstado3], opcion1, subOpcion4, "23/11/2023 15:23", accion6, '10:17', 'Solicito una tarjeta de debito', '23/11/2023 15:25');
const llamada3 = new Llamada(3, cliente2, [cambioEstado6], opcion2, subOpcion4, "23/11/2023 16:15:11");

const llamadas = [
    llamada1,
    llamada2,
    llamada3
]

const gestorLlamada = new GestorLlamada();



const { clientesFireBase, opcionValidacionesFireBase, accionesFireBase, validacionesFireBase, subOpcionesFireBase, categoriasFireBase, opcionesFireBase, estadosFireBase, cambiosDeEstadoFireBase,llamadaFireBase } = await obtenerDatos()

console.log({
    clientesFireBase, opcionValidacionesFireBase, accionesFireBase, validacionesFireBase, subOpcionesFireBase, categoriasFireBase, opcionesFireBase, estadosFireBase, cambiosDeEstadoFireBase,llamadaFireBase
})

export {
    OpcionValidacion,
    Validacion,
    SubOpcionLlamada,
    CategoriaLlamada,
    OpcionLlamada,
    Cliente,
    Accion,
    Estado,
    CambioEstado,
    Llamada,
    Iniciada,
    EnCurso,
    Finalizada,
    Colgada,
    GestorLlamada,

    gestorLlamada
}