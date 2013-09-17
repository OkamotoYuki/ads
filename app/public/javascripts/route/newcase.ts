///<reference path='../../../DefinitelyTyped/jquery/jquery.d.ts'/>
///<reference path='../api.ts'/>

$(()=>{
	var ads: ADS = new ADS(document.getElementById("ase"));

	var sidemenu = new SideMenu();

	var $id: JQuery    = $('#signup-userid');
	var $pass1: JQuery = $('#signup-pass');
	var $pass2: JQuery = $('#signup-pass2');

	function verify(): void{
		if($id.val().length > 0 && $pass1.val().length > 0 && $pass1.val() == $pass2.val()){
			$('#sign-up-form .btn').removeAttr("disabled");
		} else {
			$('#sign-up-form .btn').attr("disabled", "disabled");
		}
	};
	$id.keyup(verify);
	$pass1.keyup(verify);
	$pass2.keyup(verify);

// hide url bar for ipod touch
	setTimeout(()=>{
	window.scrollTo(0, 0);
	}, 0);
});
