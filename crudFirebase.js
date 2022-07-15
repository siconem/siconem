//analise de formularios
function habilita_criacao (firebase){
  var editar_pessoa_validacao = false
  habilita_envio_de_form(firebase,editar_pessoa_validacao)
}
function habilita_edicao (firebase){
  var editar_pessoa_validacao = true
  habilita_envio_de_form(firebase,editar_pessoa_validacao)
}
function habilita_envio_de_form(firebase,editar_pessoa_validacao){

          if (!editar_pessoa_validacao){
            const form = document.getElementById('formulario');
            form.addEventListener('submit',(e)=>{
            e.preventDefault()
            cadastra_cliente(firebase)
            form.reset()
             }) 
        }else{
          const form = document.getElementById('formulario');
          form.addEventListener('submit',(e)=>{
          e.preventDefault()
          edita_cliente(firebase)
          console.log('editando')
          form.reset()
        }) 
        }
      
      
      
      }
function desabilita_envio_de_form(){
            const form = document.getElementById('formulario');
            form.addEventListener('submit',(e)=>{
            e.preventDefault()
             }) 
        }        

function cadastra_cliente(firebase){
        const db = firebase.firestore()

      let codigo 
      let nome = document.getElementById('input_nome').value;  
      let cpf = document.getElementById('input_cpf').value;   
      let rg = document.getElementById('input_rg').value; 
      let criticidade = document.getElementById('input_criticidade').value;  

      //PEGANDO O CODIGO
      db.collection("Cod_Ref").doc('ID_Solicitacao').get()
      .then((docRef) => { 
        console.log('pegando o codigo')
        codigo = docRef.data().Sequencial
        codigo ++
        codigo = Number(codigo)
        inserir_cod_incrementado()
        criar_solicitacao()
        elemento_ancora = document.getElementById('fieldset_id');
        elemento_ancora.innerHTML += 'Cadastro realizado com sucesso, Id:' +  codigo + '<br><br>'
      })
      .catch((error) => { console.log(error)})

      function inserir_cod_incrementado(){
        console.log(codigo)
      //GERANDO O CODIGO
      db.collection('Cod_Ref').doc('ID_Solicitacao')
      .set({
        Sequencial: codigo
      })
      .then(()=>{
        console.log('GERANDO O CODIGO')
        realizar_cadastro()
      })
      .catch(e =>{
        console.log(e)
      })
    }

    function realizar_cadastro(){

        console.log(nome + " " + cpf + " " + rg)
        db.collection('Solicitacoes').doc(String(codigo))
        .set({
          nome: nome,
          cpf: cpf,
          rg: rg,
          criticidade: criticidade,
          status: 'Em Analise',
          data_criacao: firebase.firestore.FieldValue.serverTimestamp(),
          data_edicao: '',
          observacao: '',
          data_aprovacao: '',
          data_reprovacao: '',
          data_check_in: '',
          data_check_out: ''
        })
        .then()
        .catch(e =>{
          //console.log(codigo.value)
          //console.log(e)
        })
      }
    console.log('fim')
    }

function edita_cliente(){
  const db = firebase.firestore()
  let codigo = document.getElementById('input_codigo').value;  
  let nome = document.getElementById('input_nome').value;  
  let cpf = document.getElementById('input_cpf').value;   
  let rg = document.getElementById('input_rg').value;   
  let observacao = document.getElementById('input_observacao').value;  

  db.collection('Solicitacoes').doc(codigo)
  .set({
    nome: nome,
    cpf: cpf,
    rg: rg,
    status: 'Em Analise',
    data_edicao: firebase.firestore.FieldValue.serverTimestamp(),
    observacao: observacao,
  },{
    merge: true
  })
  .then(()=>{
        elemento_ancora = document.getElementById('fieldset_id');
        elemento_ancora.innerHTML += 'Id:' +  codigo + ' atualizado com sucesso!<br><br>'
  })
  .catch(e =>{
    console.log(codigo.value)
    console.log(e)
  })
}
function consulta_cliente(firebase) {
  desabilita_envio_de_form()
console.log('ta indoo')
  const db = firebase.firestore()

  let codigo = document.getElementById('input_codigo');
  let nome = document.getElementById('input_nome');  
  let cpf = document.getElementById('input_cpf');   
  let rg = document.getElementById('input_rg');   

  db.collection("Solicitacoes").doc(codigo.value).get()
  .then((docRef) => { 
    nome.value = docRef.data().nome
    cpf.value = docRef.data().cpf
    rg.value = docRef.data().rg 
  })
  .catch((error) => { console.log(error)})
    
  console.log('ta indoo')  
}

function listar_itens(firebase){
      const db = firebase.firestore()
      db.collection('Solicitacoes').onSnapshot(function(data){
        let list = document.getElementById('div_caixa_listagem');
        list.innerHTML = ''
        list.innerHTML += '<div class="linha_lista">' +
        '<div class="div_codigo_list"><a><b>Código:</b></a></div>' +
        '<div class="div_nome_list"><a><b>Nome:</b></a></div>' +
        '<div class="div_cpf_list"><a><b>CPF:</b></a></div>' + 
        '<div class="div_rg_list"><a><b>RG:</b></a></div>' + 
        '<div class="div_criticidade"><a><b>Criticidade:</b></a></div>' +
        '<div class="div_status_list"><a><b>Status:</b></a></div>' + 
        '<div class="div_dt_cria_list"><a><b>Dt Criação:</b></a></div>' +
        '<div class="div_dt_edita_list"><a><b>Dt Edição:</b></a></div>' +
        '</div>'

        data.docs.map(function(val){
          if(val.data().status == 'Em Analise'){
          list.innerHTML += '<div class="linha_lista">' +
          `<div class="div_codigo_list"><a id="${val.id}" class="id_code" onclick="var id=this.id;carregar_solicitacao_no_form(firebase,id);">${val.id}</a></div>` +
          `<div class="div_nome_list"><a>${val.data().nome}</a></div>` +
          `<div class="div_cpf_list"><a>${val.data().cpf}</a></div>`+
          `<div class="div_rg_list"><a>${val.data().rg}</a></div>` +
          `<div class="div_criticidade"><a>${val.data().criticidade}</a></div>` +
          `<div class="div_status_list"><a>${val.data().status}</a></div>` +
          `<div class="div_dt_cria_list"><a>${val.data().data_criacao}</a></div>` +
          `<div class="div_dt_edita_list"><a>${val.data().data_edicao}</a></div>` +
          '</div>'
        }
        })
    })
    }
    function listar_itens_edicao(firebase){
      const db = firebase.firestore()
      db.collection('Solicitacoes').onSnapshot(function(data){
        let list = document.getElementById('div_caixa_listagem');
        list.innerHTML = ''
        list.innerHTML += '<div class="linha_lista">' +
        '<div class="div_codigo_list"><a><b>Código:</b></a></div>' +
        '<div class="div_nome_list"><a><b>Nome:</b></a></div>' +
        '<div class="div_cpf_list"><a><b>CPF:</b></a></div>' + 
        '<div class="div_rg_list"><a><b>RG:</b></a></div>' + 
        '<div class="div_criticidade"><a><b>Criticidade:</b></a></div>' +
        '<div class="div_status_list"><a><b>Status:</b></a></div>' + 
        '<div class="div_dt_cria_list"><a><b>Dt Criação:</b></a></div>' +
        '<div class="div_dt_edita_list"><a><b>Dt Edição:</b></a></div>' +
        '<div class="div_dt_reprovacao"><a><b>Dt Reprovação:</b></a></div>' +
        '</div>'

        data.docs.map(function(val){
          if(val.data().status == 'Em Analise' || val.data().status == 'Reprovado'){
          list.innerHTML += '<div class="linha_lista">' +
          `<div class="div_codigo_list"><a id="${val.id}" class="id_code" onclick="var id=this.id;carregar_solicitacao_no_form_edicao(firebase,id);">${val.id}</a></div>` +
          `<div class="div_nome_list"><a>${val.data().nome}</a></div>` +
          `<div class="div_cpf_list"><a>${val.data().cpf}</a></div>`+
          `<div class="div_rg_list"><a>${val.data().rg}</a></div>` +
          `<div class="div_criticidade"><a>${val.data().criticidade}</a></div>` +
          `<div class="div_status_list"><a>${val.data().status}</a></div>` +
          `<div class="div_dt_cria_list"><a>${val.data().data_criacao}</a></div>` +
          `<div class="div_dt_edita_list"><a>${val.data().data_edicao}</a></div>` +
          `<div class="div_dt_reprovacao"><a>${val.data().data_reprovacao}</a></div>` +
          '</div>'
        }
        })
    })
    }
    function listar_itens_operacao(firebase){
      const db = firebase.firestore()
      db.collection('Solicitacoes').onSnapshot(function(data){
        let list = document.getElementById('div_caixa_listagem');
        list.innerHTML = ''
        list.innerHTML += '<div class="linha_lista">' +
        '<div class="div_codigo_list"><a><b>Código:</b></a></div>' +
        '<div class="div_nome_list"><a><b>Nome:</b></a></div>' +
        '<div class="div_cpf_list"><a><b>CPF:</b></a></div>' + 
        '<div class="div_rg_list"><a><b>RG:</b></a></div>' + 
        '<div class="div_criticidade"><a><b>Criticidade:</b></a></div>' +
        '<div class="div_status_list"><a><b>Status:</b></a></div>' + 
        '<div class="div_dt_cria_list"><a><b>Dt Criação:</b></a></div>' +
        '<div class="div_dt_edita_list"><a><b>Dt Edição:</b></a></div>' +
        '<div class="div_dt_reprovacao"><a><b>Dt Reprovação:</b></a></div>' +
        '</div>'

        data.docs.map(function(val){
          if(val.data().criticidade == 'Critico' && (val.data().status == 'Aprovado'  ||  val.data().status == 'Em Processamento')){
          list.innerHTML += '<div class="linha_lista">' +
          `<div class="div_codigo_list"><a id="${val.id}" class="id_code" onclick="var id=this.id;carregar_solicitacao_no_form_edicao(firebase,id);">${val.id}</a></div>` +
          `<div class="div_nome_list"><a>${val.data().nome}</a></div>` +
          `<div class="div_cpf_list"><a>${val.data().cpf}</a></div>`+
          `<div class="div_rg_list"><a>${val.data().rg}</a></div>` +
          `<div class="div_criticidade"><a>${val.data().criticidade}</a></div>` +
          `<div class="div_status_list"><a>${val.data().status}</a></div>` +
          `<div class="div_dt_cria_list"><a>${val.data().data_criacao}</a></div>` +
          `<div class="div_dt_edita_list"><a>${val.data().data_edicao}</a></div>` +
          `<div class="div_dt_reprovacao"><a>${val.data().data_reprovacao}</a></div>` +
          '</div>'
        }})
        data.docs.map(function(val){
        if(val.data().criticidade == 'Normal' && (val.data().status == 'Aprovado'  ||  val.data().status == 'Em Processamento')){
          list.innerHTML += '<div class="linha_lista">' +
          `<div class="div_codigo_list"><a id="${val.id}" class="id_code" onclick="var id=this.id;carregar_solicitacao_no_form_edicao(firebase,id);">${val.id}</a></div>` +
          `<div class="div_nome_list"><a>${val.data().nome}</a></div>` +
          `<div class="div_cpf_list"><a>${val.data().cpf}</a></div>`+
          `<div class="div_rg_list"><a>${val.data().rg}</a></div>` +
          `<div class="div_criticidade"><a>${val.data().criticidade}</a></div>` +
          `<div class="div_status_list"><a>${val.data().status}</a></div>` +
          `<div class="div_dt_cria_list"><a>${val.data().data_criacao}</a></div>` +
          `<div class="div_dt_edita_list"><a>${val.data().data_edicao}</a></div>` +
          `<div class="div_dt_reprovacao"><a>${val.data().data_reprovacao}</a></div>` +
          '</div>'
        }
        })
    })
    }


    function carregar_solicitacao_no_form(firebase,id) {
        const db = firebase.firestore()
      
        let codigo = document.getElementById('input_codigo');
        let nome = document.getElementById('input_nome');  
        let cpf = document.getElementById('input_cpf');   
        let rg = document.getElementById('input_rg');   
        let observacao = document.getElementById('input_observacao');
      
        db.collection("Solicitacoes").doc(id).get()
        .then((docRef) => { 
          codigo.value = id
          nome.value = docRef.data().nome
          cpf.value = docRef.data().cpf
          rg.value = docRef.data().rg 
          observacao.value = docRef.data().observacao 
        })
        .catch((error) => { console.log(error)})
    }

    function carregar_solicitacao_no_form_edicao(firebase,id){
      const db = firebase.firestore()
      


      let codigo = document.getElementById('input_codigo');
      let nome = document.getElementById('input_nome');  
      let cpf = document.getElementById('input_cpf');   
      let rg = document.getElementById('input_rg'); 
      let observacao = document.getElementById('input_observacao');   
  
    
      db.collection("Solicitacoes").doc(id).get()
      .then((docRef) => { 
        codigo.value = id
        nome.value = docRef.data().nome
        cpf.value = docRef.data().cpf
        rg.value = docRef.data().rg 
        observacao.value = docRef.data().observacao 
        var status_solicitacao =  docRef.data().status 
        veja_botao(status_solicitacao)
      })
      .catch((error) => { console.log(error)})

      function veja_botao(status_solicitacao){
        if(status_solicitacao == "Aprovado"){
          botao = document.getElementById('botao_check_in_out');
          botao.setAttribute('onclick', 'desabilita_envio_de_form();check_in_solicitacao(firebase);habilita_envio_de_form()');
          botao.innerText = 'Check In' 
        }else{
          botao = document.getElementById('botao_check_in_out');
          botao.setAttribute('onclick', 'desabilita_envio_de_form();check_out_solicitacao(firebase);habilita_envio_de_form()');
          botao.innerText = 'Check Out' 
        }
      }


    }


  function aprovar_solicitacao(firebase){
     

      const db = firebase.firestore()
      let codigo = document.getElementById('input_codigo').value;  
      let observacao = document.getElementById('input_observacao').value;  
      let div_lista = document.getElementById('div_caixa_listagem')
      div_lista.innerHTML = ''
      db.collection('Solicitacoes').doc(codigo)
      .set({
        status: 'Aprovado',
        observacao: observacao,
        data_aprovacao: firebase.firestore.FieldValue.serverTimestamp()
      },{
        merge: true
      })
      .then(()=>{
            elemento_ancora = document.getElementById('fieldset_id');
            elemento_ancora.innerHTML += 'Id:' +  codigo + ' aprovado com sucesso!<br><br>'
      })
      .catch(e =>{
        console.log(codigo.value)
        console.log(e)
      })
      
    }
    function reprovar_solicitacao(firebase){
     

      const db = firebase.firestore()
      let codigo = document.getElementById('input_codigo').value;  
      let observacao = document.getElementById('input_observacao').value;  
      let div_lista = document.getElementById('div_caixa_listagem')
      div_lista.innerHTML = ''
      db.collection('Solicitacoes').doc(codigo)
      .set({
        status: 'Reprovado',
        observacao: observacao,
        data_reprovacao: firebase.firestore.FieldValue.serverTimestamp()
      },{
        merge: true
      })
      .then(()=>{
            elemento_ancora = document.getElementById('fieldset_id');
            elemento_ancora.innerHTML += 'Id:' +  codigo + ' Reprovado com sucesso!<br><br>'
      })
      .catch(e =>{
        console.log(codigo.value)
        console.log(e)
      })
      
    }
    function check_in_solicitacao(firebase){
     

      const db = firebase.firestore()
      let codigo = document.getElementById('input_codigo').value;  
      let div_lista = document.getElementById('div_caixa_listagem')
      div_lista.innerHTML = ''
      db.collection('Solicitacoes').doc(codigo)
      .set({
        status: 'Em Processamento',
        data_check_in: firebase.firestore.FieldValue.serverTimestamp()
      },{
        merge: true
      })
      .then(()=>{
            elemento_ancora = document.getElementById('fieldset_id');
            elemento_ancora.innerHTML += 'Id:' +  codigo + ' Check In realizado com sucesso!<br><br>'
            botao = document.getElementById('botao_check_in_out');
            botao.setAttribute('onclick', 'desabilita_envio_de_form();check_out_solicitacao(firebase);habilita_envio_de_form()');
            botao.innerText = 'Check Out' 
      })
      .catch(e =>{
        console.log(codigo.value)
        console.log(e)
      })
      
    }
    function check_out_solicitacao(firebase){
     

      const db = firebase.firestore()
      let codigo = document.getElementById('input_codigo').value;  
      let div_lista = document.getElementById('div_caixa_listagem')
      div_lista.innerHTML = ''
      db.collection('Solicitacoes').doc(codigo)
      .set({
        status: 'Finalizado',
        data_check_out: firebase.firestore.FieldValue.serverTimestamp()
      },{
        merge: true
      })
      .then(()=>{
            elemento_ancora = document.getElementById('fieldset_id');
            elemento_ancora.innerHTML += 'Id:' +  codigo + ' Check Out realizado com sucesso!<br><br>'
            const form = document.getElementById('formulario');
            form.reset()
      })
      .catch(e =>{
        console.log(codigo.value)
        console.log(e)
      })
      
    }