import { collection, getDoc, getDocs } from "firebase/firestore/lite";
import { FirebaseDB } from "../firebase/config";
import {
    Accion, Cliente, OpcionValidacion, Validacion, SubOpcionLlamada,
    CategoriaLlamada, OpcionLlamada, CambioEstado, Llamada, GestorLlamada, Iniciada, EnCurso, Finalizada, Colgada
} from "./classes";



const obtenerOpcionesValidacionDesdeFirebase = async (opcionesRefs = null) => {

    let opcionValidacionReferences = []

    if (opcionesRefs) {
        opcionValidacionReferences = opcionesRefs;
    } else {
        const opcionesSnapshot = await getDocs(collection(FirebaseDB, 'opcionvalidaciones'));
        opcionValidacionReferences = opcionesSnapshot.docs.map((doc) => doc.ref);
    }

    const opcionesPromises = opcionValidacionReferences.map(async (doc) => {
        const docSnap = await getDoc(doc);
        if (docSnap.exists()) {
            const data = docSnap.data();
            const firebaseId = docSnap.id;

            if (opcionesRefs) {
                return new OpcionValidacion(firebaseId, data.nombre, data.esCorrecta);
            } else {
                return new OpcionValidacion(firebaseId, ...Object.values(data));
            }
        }
    });

    return Promise.all(opcionesPromises);
};
const obtenerClienteDesdeFirebase = async (clienteRef = null) => {
    if (clienteRef) {
        if (Array.isArray(clienteRef)) {
            const clientesPromises = clienteRef.map(async (doc) => {
                const docSnap = await getDoc(doc);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    const firebaseId = docSnap.id;
                    return new Cliente(firebaseId, ...Object.values(data));
                }
            });
            return Promise.all(clientesPromises);
        } else {
            const docSnap = await getDoc(clienteRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                const firebaseId = docSnap.id;
                return [new Cliente(firebaseId, ...Object.values(data))];
            }
        }
    } else {
        const clientesSnapshot = await getDocs(collection(FirebaseDB, 'clientes'));
        const clienteReference = clientesSnapshot.docs.map((doc) => doc.ref);

        const clientesPromises = clienteReference.map(async (doc) => {
            const docSnap = await getDoc(doc);
            if (docSnap.exists()) {
                const data = docSnap.data();
                const firebaseId = docSnap.id;
                return new Cliente(firebaseId, ...Object.values(data));
            }
        });

        return Promise.all(clientesPromises);
    }
};
const obtenerAccionesDesdeFirebase = async (accionRef) => {
    if (accionRef) {
        if (Array.isArray(accionRef)) {
            const accionesPromises = accionRef.map(async (doc) => {
                const docSnap = await getDoc(doc);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    const firebaseId = docSnap.id;
                    return new Accion(firebaseId, ...Object.values(data));
                }
            });
            return Promise.all(accionesPromises);
        } else {
            const docSnap = await getDoc(accionRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                const firebaseId = docSnap.id;
                return [new Accion(firebaseId, ...Object.values(data))];
            }
        }
    } else {
        const accionsSnapshot = await getDocs(collection(FirebaseDB, 'acciones'));
        const accionReferences = accionsSnapshot.docs.map((doc) => doc.ref);

        const accionesPromises = accionReferences.map(async (doc) => {
            const docSnap = await getDoc(doc);
            if (docSnap.exists()) {
                const data = docSnap.data();
                const firebaseId = docSnap.id;
                return new Accion(firebaseId, ...Object.values(data));
            }
        });

        return Promise.all(accionesPromises);
    };
};
const obtenerValidacionesDesdeFirebase = async (validacionesRefs = null) => {
    let validacionReferences = [];

    if (validacionesRefs) {
        validacionReferences = validacionesRefs;
    } else {
        const validacionSnapshot = await getDocs(collection(FirebaseDB, 'validaciones'));
        validacionReferences = validacionSnapshot.docs.map((doc) => doc.ref);
    }

    const validacionesPromises = validacionReferences.map(async (doc) => {
        const docSnap = await getDoc(doc);
        if (docSnap.exists()) {
            const data = docSnap.data();
            const firebaseId = docSnap.id;

            const opcionesInstances = await obtenerOpcionesValidacionDesdeFirebase(data.opciones);
            return new Validacion(firebaseId, data.nombre, opcionesInstances);
        }
    });

    return Promise.all(validacionesPromises);
};
const obtenerSubOpcionesDesdeFirebase = async (subOpcionesRefs = null) => {

    if (subOpcionesRefs) {
        if (Array.isArray(subOpcionesRefs)) {
            const subOpcionesPromises = subOpcionesRefs.map(async (doc) => {
                const docSnap = await getDoc(doc);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    const firebaseId = docSnap.id;
                    const validacionesInstances = await obtenerValidacionesDesdeFirebase(data.validaciones);
                    return new SubOpcionLlamada(firebaseId, data.nombre, validacionesInstances);
                }
            });
            return Promise.all(subOpcionesPromises);
        } else {
            const docSnap = await getDoc(subOpcionesRefs);
            if (docSnap.exists()) {
                const data = docSnap.data();
                const firebaseId = docSnap.id;
                const validacionesInstances = await obtenerValidacionesDesdeFirebase(data.validaciones);
                return [new SubOpcionLlamada(firebaseId, data.nombre, validacionesInstances)];
            }
        }
    } else {
        const subOpcionesSnapshot = await getDocs(collection(FirebaseDB, 'subopciones'));
        const subOpcionesReferences = subOpcionesSnapshot.docs.map((doc) => doc.ref);

        const subOpcionesPromises = subOpcionesReferences.map(async (doc) => {
            const docSnap = await getDoc(doc);
            if (docSnap.exists()) {
                const data = docSnap.data();
                const firebaseId = docSnap.id;
                const validacionesInstances = await obtenerValidacionesDesdeFirebase(data.validaciones);
                return new SubOpcionLlamada(firebaseId, data.nombre, validacionesInstances);
            }
        });

        return Promise.all(subOpcionesPromises);
    }
};
const obtenercategoriaDesdeFirebase = async () => {
    const categoriaSnapshot = await getDocs(collection(FirebaseDB, 'categorias'));
    const categoriaReferences = categoriaSnapshot.docs.map((doc) => doc.ref);

    const categoriaInstances = categoriaReferences.map(async (doc) => {
        const docSnap = await getDoc(doc);
        if (docSnap.exists()) {
            const data = docSnap.data();
            const firebaseId = docSnap.id;
            const subOpcionesInstances = await obtenerSubOpcionesDesdeFirebase(data.opcionesLlamada);
            return new CategoriaLlamada(firebaseId, data.nombre, subOpcionesInstances);
        }
    });

    return Promise.all(categoriaInstances);
};
const obtenerOpcionLlamadaDesdeFirebase = async (opcionesRef = null) => {

    if (opcionesRef) {
        if (Array.isArray(opcionesRef)) {
            const opcionesPromises = opcionesRef.map(async (doc) => {
                const docSnap = await getDoc(doc);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    const firebaseId = docSnap.id;
                    const subOpcionesInstances = await obtenerSubOpcionesDesdeFirebase(data.opcionesLlamada);
                    const validacionesInstances = await obtenerValidacionesDesdeFirebase(data.validaciones);
                    return new OpcionLlamada(firebaseId, data.nombre, subOpcionesInstances, validacionesInstances);
                }
            });
            return Promise.all(opcionesPromises);
        } else {
            const docSnap = await getDoc(opcionesRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                const firebaseId = docSnap.id;
                const subOpcionesInstances = await obtenerSubOpcionesDesdeFirebase(data.opcionesLlamada);
                const validacionesInstances = await obtenerValidacionesDesdeFirebase(data.validaciones);
                return [new OpcionLlamada(firebaseId, data.nombre, subOpcionesInstances, validacionesInstances)];
            }
        }
    } else {
        const opcionesSnapshot = await getDocs(collection(FirebaseDB, 'opciones'));
        const opcionesReferences = opcionesSnapshot.docs.map((doc) => doc.ref);


        const opcionesPromises = opcionesReferences.map(async (doc) => {
            const docSnap = await getDoc(doc);
            if (docSnap.exists()) {
                const data = docSnap.data();
                const firebaseId = docSnap.id;
                const subOpcionesInstances = await obtenerSubOpcionesDesdeFirebase(data.opcionesLlamada);
                const validacionesInstances = await obtenerValidacionesDesdeFirebase(data.validaciones);
                return new OpcionLlamada(firebaseId, data.nombre, subOpcionesInstances, validacionesInstances);
            }
        });

        return Promise.all(opcionesPromises);
    }
}
const obtenerEstadosDesdeFirebase = async () => {
    const collectionClasses = {
        'iniciada': Iniciada,
        'finalizada': Finalizada,
        'encurso': EnCurso,
        'colgada': Colgada
    };

    const collectionNames = Object.keys(collectionClasses);
    const estadosPromises = [];

    for (const collectionName of collectionNames) {
        const estadosSnapshot = await getDocs(collection(FirebaseDB, collectionName));
        const estadosReferences = estadosSnapshot.docs.map((doc) => doc.ref);

        const estadosCollectionPromises = estadosReferences.map(async (doc) => {
            const docSnap = await getDoc(doc);
            if (docSnap.exists()) {
                const data = docSnap.data();
                const firebaseId = docSnap.id;
                const CollectionClass = collectionClasses[collectionName]; // Obtener la clase correspondiente
                return new CollectionClass(firebaseId, ...Object.values(data));
            }
        });

        estadosPromises.push(...estadosCollectionPromises);
    }

    return Promise.all(estadosPromises);
};
const obtenerCambiosDeEstadoDesdeFirebase = async (cambioEstadosRef = null) => {

    let cambiosDeEstadoReferences = [];

    if (cambioEstadosRef) {
        cambiosDeEstadoReferences = cambioEstadosRef;
    }
    else {
        const cambiosDeEstadoSnapshot = await getDocs(collection(FirebaseDB, 'cambioestados'));
        cambiosDeEstadoReferences = cambiosDeEstadoSnapshot.docs.map((doc) => doc.ref);
    }

    const cambiosDeEstadoInstances = cambiosDeEstadoReferences.map(async (doc) => {
        const docSnap = await getDoc(doc);
        if (docSnap.exists()) {
            const data = docSnap.data();
            const firebaseId = docSnap.id;
            let estadoInstancia = null;

            // Obtener el estado asociado al DocumentReference
            const estadoDoc = await getDoc(data.estado);
            if (estadoDoc.exists()) {
                const estadoData = estadoDoc.data();

                // Crear la instancia correspondiente según el tipo de estado
                switch (estadoData.nombre) { // Suponiendo un campo 'tipoEstado' en tus documentos de estado
                    case 'Iniciada':
                        estadoInstancia = new Iniciada();
                        break;
                    case 'Finalizada':
                        estadoInstancia = new Finalizada();
                        break;
                    case 'EnCurso':
                        estadoInstancia = new EnCurso();
                        break;
                    case 'Colgada':
                        estadoInstancia = new Colgada();
                        break;
                    default:
                        break;
                }
            }
            return new CambioEstado(firebaseId, estadoInstancia, data.fechaHoraInicio, data.fechaHoraFin);
        }
    });

    return Promise.all(cambiosDeEstadoInstances);
};
const obtenerLlamadaDesdeFirebase = async () => {
    const llamadaSnapshot = await getDocs(collection(FirebaseDB, 'llamadas'));
    const llamadaReferences = llamadaSnapshot.docs.map((doc) => doc.ref);

    const llamadaPromises = llamadaReferences.map(async (doc) => {
        const docSnap = await getDoc(doc);
        if (docSnap.exists()) {
            const data = docSnap.data();
            const firebaseId = docSnap.id;
            const clientes = await obtenerClienteDesdeFirebase(data.cliente)
            const cliente = clientes[0]
            const cambioEstado = await obtenerCambiosDeEstadoDesdeFirebase(data.cambioEstado)
            const opcion = await obtenerOpcionLlamadaDesdeFirebase(data.opcionLlamada)
            const subOpcion = await obtenerSubOpcionesDesdeFirebase(data.subOpcionLlamada)
            const acciones = await obtenerAccionesDesdeFirebase(data.accion)
            const accion = acciones[0]
            return new Llamada(firebaseId, cliente, cambioEstado, opcion, subOpcion, data.fechaHoraInicio, accion, data.duracion, data.descripcionOperador, data.fechaHoraFin)
        }
    });

    return Promise.all(llamadaPromises);
}

const obtenerDatos = async () => {
    const [clientesFireBase, opcionValidacionesFireBase, accionesFireBase, validacionesFireBase, subOpcionesFireBase, categoriasFireBase, opcionesFireBase, estadosFireBase, cambiosDeEstadoFireBase,llamadaFireBase] = await Promise.all([
        obtenerOpcionesValidacionDesdeFirebase(),
        obtenerClienteDesdeFirebase(),
        obtenerAccionesDesdeFirebase(),
        obtenerValidacionesDesdeFirebase(),
        obtenerSubOpcionesDesdeFirebase(),
        obtenercategoriaDesdeFirebase(),
        obtenerOpcionLlamadaDesdeFirebase(),
        obtenerEstadosDesdeFirebase(),
        obtenerCambiosDeEstadoDesdeFirebase(),
        obtenerLlamadaDesdeFirebase()
    ]);

    return { clientesFireBase, opcionValidacionesFireBase, accionesFireBase, validacionesFireBase, subOpcionesFireBase, categoriasFireBase, opcionesFireBase, estadosFireBase, cambiosDeEstadoFireBase,llamadaFireBase };
};
export {obtenerDatos}
