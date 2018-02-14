DROP PROCEDURE cnbcarechw59.maj_mesure;
SET NAMES 'utf8' COLLATE 'utf8_general_ci';
DELIMITER |
 CREATE PROCEDURE cnbcarechw59.maj_mesure (IN type_mesure VARCHAR(10),IN email1  VARCHAR(10) CHARSET utf8 , IN modele1 VARCHAR(10),IN value1 INT )  
BEGIN 
	 select   id into   @patient_id1      from cnbcarechw59.patient where login =   email1 limit 1  ;
	 select id into  @marque_bracelet_id1  from cnbcarechw59.marque_bracelet where modèle =   modele1  limit 1 ;
	 select id into  @session_patient_id1 from cnbcarechw59.session_patient where patient_id=  @patient_id1 and marque_bracelet_id= @marque_bracelet_id1  limit 1 ;
		IF  (@patient_id1 IS NOT NULL)  THEN  
			  insert into cnbcarechw59.mesure(valeur_type_nombre ,
			                     date_mesure,
								 valeur_type_date,
								 type_mesure,
								   patient_id  ,
								 session_patient_id,
								 marque_bracelet_id) 
			  values(value1,CURRENT_TIMESTAMP(),NULL,type_mesure, @patient_id1,@session_patient_id1,@marque_bracelet_id1);
		END IF;
	 
END 
|
