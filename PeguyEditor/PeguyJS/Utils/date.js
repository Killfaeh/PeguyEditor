var PERIOD_TYPE = 
{
	WEEK: 0, 
	MONTH: 100,
	YEAR: 200,
	CUSTOM: 500
};

Date.prototype.getSQLFormat = function()
{
	var day = this.getDate();
	var month = this.getMonth()+1;
		
	if (day < 10)
		day = "0" + day;
			
	if (month < 10)
		month = "0" + month;
	
	return this.getFullYear() + "-" + month + "-" + day;
};

var DateUtils = 
{
	// Convertir un nombre de jours en millisecondes
	dayToTime: function($days)
	{
		return $days*24*60*60*1000;
	},
	
	// Convertir un nombre de millisecondes en jours
	timeToDay: function($milli)
	{
		return $milli/24/60/60/1000;
	},
	
	// Convertir un nombre de minutes en heure au format hh:mm
	minutesToHours: function($minutes)
	{
		var hours = "00:00";
		
		if ($minutes < 60)
		{
			if ($minutes < 10)
				hours = "00:0" + $minutes;
			else
				hours = "00:" + $minutes;
		}
		else
		{
			var extraMinutes = $minutes%60;
			var completeHours = Math.floor(($minutes-extraMinutes)/60);
			
			if (completeHours < 10)
				completeHours = "0" + completeHours;
			
			if (extraMinutes < 10)
				extraMinutes = "0" + extraMinutes;
			
			hours = completeHours + ":" + extraMinutes;
		}
		
		return hours;
	}
};

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("date");