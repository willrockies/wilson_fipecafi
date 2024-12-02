
async function apiRequest(endpoint, method, body = null) {
    const baseUrl = "https://localhost:7120"; 
  
    const options = {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
    };
  
    if (body) {
      options.body = JSON.stringify(body);
    }
  
    const response = await fetch(`${baseUrl}/${endpoint}`, options);
  
    if (!response.ok) {
      throw new Error(`Erro na API: ${response.statusText}`);
    }
  
    return await response.json();
  }
  

  async function getCursos() {
    try {
      const cursos = await apiRequest("Curso", "GET");
      if (cursos && Array.isArray(cursos)) {
        populateCursosSelect(cursos);
      } else {
        console.error("Nenhum curso encontrado.");
      }
    } catch (error) {
      console.error("Erro ao buscar cursos:", error);
    }
  }
  

  function populateCursosSelect(cursos) {
    const selectElement = document.getElementById("cursoFiltro");
    selectElement.innerHTML = '<option value="">Selecione um curso</option>'; 
  
    cursos.forEach((curso) => {
      const option = document.createElement("option");
      option.value = curso.id;
      option.textContent = curso.descricao;
      selectElement.appendChild(option);
    });
  }
  
  
  async function getLeads(nome = "", email = "", cursoId = null) {
  
    let endpoint = "lead?";
    
    // Adicionar os filtros na URL apenas se eles não estiverem vazios
    if (nome) endpoint += `nome=${encodeURIComponent(nome)}&`;
    if (email) endpoint += `email=${encodeURIComponent(email)}&`;
    if (cursoId) endpoint += `cursoId=${cursoId}&`;
  
    // Remover o último '&' se houver
    endpoint = endpoint.endsWith('&') ? endpoint.slice(0, -1) : endpoint;
  
    try {
      const leads = await apiRequest(endpoint, "GET");
      populateLeadsTable(leads);
    } catch (error) {
      console.error("Erro ao buscar leads:", error);
    }
  }
  
  
  
  async function populateLeadsTable(leads) {
    const tableBody = document.querySelector("#leadsTable tbody");
    tableBody.innerHTML = ""; 
    const turmaSection = document.getElementById("turmaSection");
    const matricularBtn = document.getElementById("matricularBtn");

    if (leads.length === 0) {
        
        turmaSection.style.display = "none";
        matricularBtn.style.display = "none";
        alert("Nenhum Curso/Turma encontrado.");
        return;
      }
    for (const lead of leads) {
        const cursoDescricao = await getCursoDescricao(lead.cursoId); 
        const row = document.createElement("tr");
        row.dataset.leadId = lead.id;
        row.innerHTML = `
          <td>${lead.nome}</td>
          <td>${lead.email}</td>
          <td>${cursoDescricao || 'N/A'}</td>
        `;
        tableBody.appendChild(row);
      }

      turmaSection.style.display = "block";
      matricularBtn.style.display = "block";
  }
  async function getCursoDescricao(cursoId) {
    try {
      const curso = await apiRequest(`curso/${cursoId}`, "GET");
      return curso ? curso.descricao : 'N/A';
    } catch (error) {
      console.error("Erro ao buscar descrição do curso:", error);
      return 'N/A'; 
    }
  }
  

  async function getTurmas(cursoId) {
    try {
      if (!cursoId) {
        populateTurmasSelect([]);
        return;
      }
      const turmas = await apiRequest(`Alunos/turmas/${cursoId}`, "GET");
      
      populateTurmasSelect(turmas);
    } catch (error) {
      console.error("Erro ao buscar turmas:", error);
    }
  }
  
  function populateTurmasSelect(turmas) {
    const selectElement = document.getElementById("turmaSelect");
    selectElement.innerHTML = '<option value="">Selecione uma turma</option>'; 
  
    turmas.forEach((turma) => {
      const option = document.createElement("option");
      option.value = turma.id;
      option.textContent = turma.descricao; 
      selectElement.appendChild(option);
    });
  }

  async function matricularLead() {
    const turmaId = document.getElementById("turmaSelect").value; 
    const tableRows = document.querySelectorAll("#leadsTable tbody tr"); 
  
    if (!turmaId) {
      alert("Selecione uma turma antes de matricular!");
      return;
    }
  
    try {
      for (const row of tableRows) {
        const leadId = row.dataset.leadId; 
        const nome = row.cells[0].textContent; 
        const email = row.cells[1].textContent; 
        const curso = row.cells[2].textContent; 
  
        const lead = {
          nome,
          email,
          curso,
          turmaId: parseInt(turmaId), 
        };
  
       
        await apiRequest(`Alunos/matricular/${leadId}`, "POST", lead);
      }
  
      alert("Leads matriculados com sucesso!");
     
      document.querySelector("#leadsTable tbody").innerHTML = "";
    } catch (error) {
      console.error("Erro ao matricular leads:", error);
      alert("Erro ao matricular leads!");
    }
  }
  
  // Função para configurar o evento de busca quando o botão for clicado
  document.getElementById("buscarBtn").addEventListener("click", () => {
    const nome = document.getElementById("nomeFiltro").value;
    const email = document.getElementById("emailFiltro").value;
    const cursoId = document.getElementById("cursoFiltro").value;
  
    getLeads(nome, email, cursoId);
  });
  

  document.addEventListener("DOMContentLoaded", () => {
    getCursos();
  });
  
  
document.getElementById("matricularBtn").addEventListener("click", matricularLead);


document.getElementById("cursoFiltro").addEventListener("change", (event) => {
  const cursoId = event.target.value;
  getTurmas(cursoId);
});