/**
 * ownCloud - mistrabajos
 *
 * This file is licensed under the Affero General Public License version 3 or
 * later. See the COPYING file.
 *
 * @author IvonneBurgos <irburgos@espol.edu.ec>
 * @copyright IvonneBurgos 2016
 */

(function ($, OC) {

	$(document).ready(function () {
        
		var timer = false;
		ajaxRequestDon();

        $('#endJob').attr("class", "selectedOption");

		$('#endJob').click(function () {
			$('#endJob').attr("class", "selectedOption");
			$('#processJob').attr("class", " ");
			if (timer !== false){
				clearInterval(timer);
				timer = false;
				 ajaxRequestDon();
			}
			 
			
		});

		$('#processJob').click(function () {
			$('#bigCont').empty();
			$('#processJob').attr("class", "selectedOption");
			$('#endJob').attr("class", " ");
			timer = setInterval(ajaxRequestProcess, 1000);
		});
		
	});

	function ajaxRequestDon(){
 
		var jobsArray = { "data" :[]};
		//var jobsArray =[];
		var url = OC.generateUrl('/apps/mistrabajos/echo');
			var data = {
				type: "jobs"
			};
			$.post(url, data).success(function (response) {
				$('#bigCont').empty();
				var listnum=0;
				var completeData = JSON.parse(response.get);
				var count = Object.keys(completeData.jobs).length;
				for (var i = 0; i < count; i++) {
					    if (completeData.jobs[i].state === " DON" && completeData.jobs[i].user_name === $('#userNameFront').text()){
					    	listnum+=1;
							var utcSeconds = completeData.jobs[i].time_started;
							var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
							d.setUTCSeconds(utcSeconds);
							var date = formatDate(d);
							var percentage = "<div class='progress-bar' role='progressbar' aria-valuenow= '60' aria-valuemin='0' aria-valuemax='100' style='width:100%;'>"+ completeData.jobs[i].blocks[0].p_percentage+"%</div>";
							jobsArray.data.push({ "listnum":listnum, "name":completeData.jobs[i].name, "date": date, "percentage":percentage});
							//jobsArray.push("<tr><td>"+listnum+"</td><td>"+completeData.jobs[i].name+" </td><td> "+date+" </td><td> "+ percentage+" </td><td>Completo</td><td><a href='#'>  <i class='fa fa-arrow-circle-o-down fa-2x'></i></a><td></tr>");
					}	
				}
				//jobsArray.data.sort(comp);
				addData(jobsArray.data.sort(comp));
			});
		};

	function ajaxRequestProcess(){

		var jobsArray = [];
		var url = OC.generateUrl('/apps/mistrabajos/echo');
			var data = {
				type: "jobs"
			};
			$.post(url, data).done(function (response) {
				$('#bigCont').empty();
				var listnum=0;
			    var completeData = JSON.parse(response.get);
				var count = Object.keys(completeData.jobs).length;
				for (var i = 0; i < count; i++) {
					if (completeData.jobs[i].state !== " DON" && completeData.jobs[i].user_name === $('#userNameFront').text()){
						    listnum+=1;
					    	var utcSeconds = completeData.jobs[i].time_started;
							var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
							d.setUTCSeconds(utcSeconds);
							var date = formatDate(d);
								$('#bigCont').append('<div class="panel panel-default"><div class="panel-body"><div class="panel body-head"><h3>'+completeData.jobs[i].name+'</h3><span class="label label-primary">Renderizando...</span></div><div class="panel body-info"><div class="panel row-info"><p class="info-label">Fecha: </p><p class="info-text">'+date+'</p></div><div class="progress"><div class="progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width: '+completeData.jobs[i].blocks[0].p_percentage+'%;">'+completeData.jobs[i].blocks[0].p_percentage+'%</div></div></div></div></div>');
						}
					else {
							$('#bigCont').html('<div id="processjobmessage" class="alert alert-info"><strong>Info!</strong> No hay trabajos por descargar.</div>');
						}
					}	
			});
	};

	function formatDate(d){
		date = new Date(d)
		var dd = date.getDate(); 
		var mm = date.getMonth()+1;
		var yyyy = date.getFullYear(); 
		if(dd<10){dd='0'+dd} 
		if(mm<10){mm='0'+mm};
		return d = dd+'/'+mm+'/'+yyyy
	};

	function addData(jobsArray){
		$('#bigCont').append('<table class="table"><thead><tr><th>#</th><th>Nombre de Escena</th><th>Fecha</th><th>Porcentaje de Porgreso</th><th>Estado</th><th>Descarga</th></tr></thead><tbody id="tbodyid"></tbody></table>');
		$.each(jobsArray, function (index, value) {
			$(".table tbody").append("<tr><td>"+value.listnum+"</td><td>"+value.name+" </td><td> "+value.date+" </td><td> "+ value.percentage+" </td><td>Completo</td><td><a href='#'>  <i class='fa fa-arrow-circle-o-down fa-2x'></i></a><td></tr>");
		});
		$('.table').paging({
			limit:5
		});
	};

	function comp(a, b) {

		var aa = a.date.split('/').reverse().join(),
        bb = b.date.split('/').reverse().join();
    return bb < aa ? -1 : (bb > aa ? 1 : 0);
    //return new Date(b.date) - new Date(a.date);
    //return new Date(b.date).getTime() - new Date(a.date).getTime();
};

})(jQuery, OC);