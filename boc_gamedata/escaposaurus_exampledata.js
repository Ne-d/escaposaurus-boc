<!--
/////////////////////////////////////////////////////////////
/// Escapausorus v1 (2020)
///	A quick and dirty framework to create small adventure game (certified vanilla JS)
/// Author: Stéphanie Mader (http://smader.interaction-project.net)
/// GitHub: https://github.com/RedNaK/escaposaurus
///	Licence: MIT
////////////////////////////////////////////////////////////
-->

	/*
		HERE IS THE CONFIGURATION OF THE GAME
	*/
	/*either online with VOD server and JSON load of data
	either local */
	
var isLocal = true;
var gameRoot = "./";
var gameDataRoot = gameRoot + "boc_gamedata/";
var videoRoot = gameDataRoot + "videos/";

/*caller app*/
var contactVideoRoot = videoRoot + "contactVideo/";

/*full path to intro / outro video*/
var missionVideoPath = videoRoot + "introVideo/introMamie.mp4";
var introVideoPath = videoRoot + "introVideo/introAvocat.mp4";
var missingVideoPath = videoRoot + "contactVideo/missing/final.mp4"; // TODO
var epilogueVideoPath = videoRoot + "epilogueVideo/epiloguecredit.mp4"; // TODO

/*udisk JSON path*/
var udiskRoot = gameDataRoot + "udisk/";

/*for online use only*/
/*var udiskJSONPath = gameRoot+"escaposaurus_gamedata/udisk.json" ;
var udiskJSONPath = "/helper_scripts/accessJSON_udisk.php" ;*/

var udiskData =
{
	"root":
	{
		"folders": [
			{
				"folders": [
					{
						"foldername": "Corbeille",
						"files": ["note_admin.jpg"]
					},
					{
						"folders": [
							{
								"folders": [
									{
										"folders": [
											{
												"files": [
													"Josseline_polaroid.jpg",
													"Maximus_1981.jpg"
												],
												"foldername": "Mes_bebous"
											},
											{
												"files": [
														"photo_avec_michel_1940.png",
														"plan_boc_michel.jpg",
													],
												"password": "stylos",
												"sequence": 3,
												"foldername": "Souvenirs"
											}
										],
										"files": [
											"memo_heritiers.jpg",
											"lettre_a_mes_petits_enfants.png"
										],
										"password": "1943",
										"sequence": 2,
										"foldername": "Perso"
									}
								],
								"files": [
									"association_ecologique_de_france.png",
									"telegramme.png",
									"resultat_analyse_12_12_2009.jpg",
									"article_armee_air.jpg"
								],
								"foldername": "Entreprise",
								"sequence": 1,
								"password": "bille"
							}
						],
						"files": [
							"MDP_tableau.png",
							"plan_boc.png",
							"scan_journal.png"
						],
						"foldername": "Tech"
					},
					{
						"files": ["Arbre_genealogique.png"]
						, "foldername": "T\u00e9l\u00e9chargements"
					}
				],
				"password": "inbocwetrust",
				"sequence": 0,
				"foldername": "session_admin"
			}
		],
		"files": []
	}
};

var gameTitle = "";
var gameDescriptionHome = "Infiltrez vous dans la tour BOC, cherchez des preuves et déterrez les sombres secrets du fondateur et PDG de l'entreprise.";
var gameMissionCall = "Connectez-vous sur l'ordinateur de Marcel BOC pour trouver une preuve qu'il a évincé votre grand-père du brevet du stylo-bille.";
var gameMissionAccept = "&raquo;&raquo; Accéder à l'ordinateur (JOUER) &laquo;&laquo;";

var gameCredit = "TODO: Un jeu conçu et réalisé par : <br/>Stéphanie Mader";
var gameThanks = "TODO: Remerciements : <br/>Stéphanie Mader;)";

var OSName = "BOC Archive Mainframe";
var explorerName = "BOC Archive File Explorer";
var callerAppName = "ePhone 4";

/*titles of video windows*/
var titleData = {};
titleData.introTitle = "Appel en cours";
titleData.epilogueTitle = "Appel en cours";
titleData.callTitle = "Appel en cours";

/*change of caller app prompt for each sequence*/
var promptDefault = "Contacts";
var prompt = [];
prompt[0] = "Contacts";
prompt[1] = "Contacts";
prompt[2] = "Contacts";
prompt[3] = "Contacts";
prompt[4] = "Appelez Maître Vernier pour conclure.";

/*when the sequence number reach this, the player win, the missing contact is added and the player can call them*/
var sequenceWin = 4;

/*before being able to call the contacts, the player has to open the main clue of the sequence as indicated in this array*/
/*if you put in the string "noHint", player will be able to immediatly call the contact at the beginning of the sequence*/
/*if you put "none" or anything that is not an existing filename, the player will NOT be able to call the contacts during this sequence*/
var seqMainHint = [];
seqMainHint[0] = "noHint";
seqMainHint[1] = "noHint";
seqMainHint[2] = "article_armee_air.jpg";
seqMainHint[3] = "noHint";
seqMainHint[4] = "photo_avec_michel_1940.png"

/*contact list, vid is the name of their folder in the videoContact folder, then the game autoload the video named seq%number of the current sequence%, e.g. seq0.MP4 for the first sequence (numbered 0 because computer science habits)
their img need to be placed in their video folder, username is their displayed name
*/
var normalContacts = [];
normalContacts[0] = {
	"vid": "Avocat",
	"vod_folder": "",
	"username": "Maître Vernier (Avocat)",
	"canal": "video",
	"avatar": "avocat_avatar.png"
};

normalContacts[1] = {
	"vid": "Mamie",
	"vod_folder": "",
	"username": "Mamie Henriette Dupuis",
	"canal": "video",
	"avatar": "mamie_avatar.png"
};

/*second part of the list, contact that can help the player*/
var helperContacts = [];
helperContacts[0] = {
	"vid": "Cam1",
	"vod_folder": "",
	"username": "Cam 1",
	"canal": "video",
	"avatar": "camera_avatar.png",
};

helperContacts[1] = {
	"vid": "Cam2",
	"vod_folder": "",
	"username": "Cam 2",
	"canal": "video",
	"avatar": "camera_avatar.png",
};

/*ce qui apparait quand on trouve le dernier élément du disque dur*/
finalStepAdded = "Félicitation, vous avez decouvert la pièce à conviciton prouvant le vol de l'invention du stylo a bille.<br/>Ouvrez le fichier \"photo_avec_michel_1940\" pour continuer.";

/*the last call, it can be the person we find in the end or anyone else we call to end the quest, allows the game to know it is the final contact that is called and to proceed with the ending*/
var missingContact = {
	"vid": "Avocat",
	"vod_folder": "",
	"username": "Maître Vernier (Avocat)",
	"canal": "video",
	"avatar": "avocat_avatar.png"
};

/*Lou only send text message, they are stored here*/
var tips = {};
tips['Albert'] = [];
tips['Albert'][0] = "Je peux pas répondre à votre appel. Mais je peux vous répondre par écrit. Donc vous cherchez le surnom d'un guide ? Je crois que les contacts sont des guides justement, essayez peut-être de les appeler.";
tips['Albert'][1] = "";
tips['Albert'][2] = "";
tips['Albert'][3] = "Ah zut, un dossier verouillé sans infos dans scan mémo ? Y'a forcément un truc mnémotechnique facile à retenir ou retrouver. Les guides en disent quoi ?";


/*text for the instruction / solution windows*/
var instructionText = {};
instructionText.winState = "Vous avez découvert la photo prouvant que l'invention du stylo-bille a été volée, vous allez certainement gagner le procès..";
instructionText.lackMainHint = "";
instructionText.password = "Vous devez trouver et entrer le mot de passe d'un des dossiers de la boite de droite. Vous pouvez trouver le mot de passe en appelant les contacts de la boite de gauche.<br/>Pour entrer un mot de passe, cliquez sur le nom d'un dossier et une fenêtre s'affichera pour que vous puissiez donner le mot de passe.";

/*please note the %s into the text that allow to automatically replace them with the right content according to which sequence the player is in*/
var solutionText = {};
solutionText.winState = "Si vous avez débloqué le dernier dossier, vous avez déjà gagné.";
solutionText.lackMainHint = "Vous devez ouvrir le fichier <b>%s</b><br/>";
solutionText.password = "Vous devez déverouiller le dossier <b>%s1</b><br/>avec le mot de passe : <b>%s2</b><br/>";