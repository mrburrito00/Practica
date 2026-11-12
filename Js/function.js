
class RolloAuditado {
    constructor(idRollo, mtsTotales, mtsDefecto) {
        this.idRollo = idRollo;
        this.mtsTotales = parseFloat(mtsTotales);
        this.mtsDefecto = parseFloat(mtsDefecto);
        this.porcentajeMerma = this.calcularMerma();
    }

    calcularMerma() {
        return ((this.mtsDefecto / this.mtsTotales) * 100);
    }

    evaluarCalidad() {
        if (this.porcentajeMerma == 0) return { texto: 'Perfecto', clase: 'text-success' };
        if (this.porcentajeMerma <= 5) return { texto: 'Aceptable', clase: 'text-warning' };
        return { texto: 'Rechazado', clase: 'text-danger fw-bold' };
    }
}

const idRolloInput = document.getElementById('idRollo');
const mtsTotalesInput = document.getElementById('mtsTotales');
const mtsDefectoInput = document.getElementById('mtsDefecto');
const btnAuditar = document.getElementById('btnAuditar');
const tablaMermas = document.getElementById('tablaMermas');

let listaAuditorias = JSON.parse(localStorage.getItem('auditoriasRollos')) || [];

btnAuditar.addEventListener('click', () => {
    const id = idRolloInput.value.trim();
    const totales = parseFloat(mtsTotalesInput.value);
    const defecto = parseFloat(mtsDefectoInput.value);

    if (!id || isNaN(totales) || isNaN(defecto)) {
        alert("Complete todos los campos");
        return;
    }

    
    if (defecto > totales) {
        alert("Los metros de defecto no pueden ser mayores a los metros totales");
        return;
    }
    
    if (totales <= 0 || defecto < 0) {
        alert("Ingrese una cantidad mayor a cero.");
        return;
    }

    const nuevoRollo = new RolloAuditado(id, totales, defecto);
    listaAuditorias.push(nuevoRollo);

    localStorage.setItem('auditoriasRollos', JSON.stringify(listaAuditorias));

    renderizarTabla();
    idRolloInput.value = '';
    mtsTotalesInput.value = '';
    mtsDefectoInput.value = '';
});

function renderizarTabla() {
    tablaMermas.innerHTML = ''; 

    listaAuditorias.forEach(item => {
        const rollo = new RolloAuditado(item.idRollo, item.mtsTotales, item.mtsDefecto);
        const estado = rollo.evaluarCalidad();

        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td><>${rollo.idRollo}</td>
            <td>${rollo.mtsTotales} m</td>
            <td>${rollo.porcentajeMerma}%</td>
            <td class="${estado.clase}">${estado.texto}</td>
        `;
        tablaMermas.appendChild(fila);
    });
}

document.addEventListener('DOMContentLoaded', renderizarTabla);