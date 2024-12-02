document.addEventListener('DOMContentLoaded', () => {
    const cursoSelect = document.getElementById('curso');
    const leadForm = document.getElementById('leadForm');
  
    // Carregar cursos da API
    fetch('https://localhost:7120/Lead')
      .then(response => response.json())
      .then(cursos => {
        cursos.forEach(curso => {
          const option = document.createElement('option');
          option.value = curso.id;
          option.textContent = curso.descricao;
          cursoSelect.appendChild(option);
        });
      });
  
    // Submeter formulário
    leadForm.addEventListener('submit', event => {
      event.preventDefault();
      const leadData = {
        nome: document.getElementById('nome').value,
        telefone: document.getElementById('telefone').value,
        email: document.getElementById('email').value,
        cursoId: cursoSelect.value
      };
  
      // Enviar dados para a API
      fetch('https://localhost:7120/Lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData)
      })
        .then(response => response.json())
        .then(data => {
          alert('Lead enviado com sucesso!');
          leadForm.reset();
        })
        .catch(error => console.error('Erro ao enviar lead:', error));
    });
  });
  

  