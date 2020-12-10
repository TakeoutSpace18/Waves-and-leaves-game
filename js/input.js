var neuroplay = null;

function bci(data)
{
	//В этой функции необходимо преобразовывать входящий сигнал (медитацию ИЛИ концентрацию) 
    //и превращать его в управляющее воздействие
    //data.meditation и data.concentration лежат в диапазоне от 0 до 100

	$("#med").html(data.meditation + "%");
  	$("#con").html(data.concentration + "%");
}

$(function() 
{
	//Этот код выполняет подключение к ПО NeuroPlay
    //10 раз в секунду запрашивает состояние нейроинтерфейса (медитацию, концентрацию и т.д.) 
    neuroplay = new NeuroplayConnector();
    neuroplay.connect();  
    neuroplay.on('bci', bci);
    setInterval(function() { neuroplay.send('bci'); }, 100);
});