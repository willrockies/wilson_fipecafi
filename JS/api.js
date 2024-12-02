

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
    console.log("Cursos recebidos da API:", cursos);
    if (cursos && Array.isArray(cursos)) {
      populateSelect(cursos);
    } else {
      console.error("Nenhum curso encontrado.");
    }
  } catch (error) {
    console.error("Erro ao buscar cursos:", error);
  }
}

function populateSelect(cursos) {
  const selectElement = document.getElementById("curso");
  selectElement.innerHTML = '<option value="">Selecione um curso</option>';

  cursos.forEach((curso) => {
    const option = document.createElement("option");
    option.value = curso.id;
    option.textContent = curso.descricao;
    selectElement.appendChild(option);
  });
  console.log("Select options populated:", selectElement.innerHTML);
}



async function createLead(leadData) {
    debugger;
  return await apiRequest("lead", "POST", leadData);
}

async function getCursoById(cursoId) {
  try {
    const cursos = await apiRequest("Curso", "GET");
    const curso = cursos.find(c => c.id === parseInt(cursoId)); 
    return curso; 
  } catch (error) {
    console.error("Erro ao buscar curso:", error);
    throw error; 
  }
}


async function createLead() {

  const nome = document.getElementById('nome').value;
  const telefone = document.getElementById('telefone').value;
  const email = document.getElementById('email').value;
  const cursoId = document.getElementById('curso').value;


  if (!nome || !telefone || !email || !cursoId) {
    alert("Por favor, preencha todos os campos.");
    return;
  }

  try {

    const curso = await getCursoById(cursoId);


    if (!curso) {
      alert("Curso não encontrado.");
      return;
    }

    
    const leadData = {
      nome: nome,
      telefone: telefone,
      email: email,
      cursoId: cursoId,
      cursoDescricao: curso.id, 
    };

    
    const result = await apiRequest("Lead", "POST", leadData);

    
    alert("Lead enviado com sucesso!");
    
    
    document.getElementById('leadForm').reset();
    
    return result;

  } catch (error) {
    
    console.error("Erro ao enviar lead:", error);
    alert("Houve um erro ao enviar o lead. Tente novamente mais tarde.");
  }
}



// async function matricularAluno(matriculaData) {
//   return await apiRequest("alunos", "POST", matriculaData);
// }

document.addEventListener("DOMContentLoaded", () => {
  getCursos();
});
  
  document.getElementById('leadForm').addEventListener('submit', (event) => {
    event.preventDefault(); 
    createLead(); 
  });
