-- Insert new record into account table
INSERT INTO public.account (
	account_firstname, 
	account_lastname, 
	account_email, 
	account_password
	)
VALUES (
	'Tony',
	'Stark',
	'tony@starkent.com',
	'Iam1ronM@n'
)

--Uppdate 
UPDATE public.account
SET account_type = 'Admin'
WHERE account_id = 1;

--Delete Tony Stark record  from database
DELETE FROM public.account
WHERE account_id = 1;

--Update the hummer description
UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_model = 'Hummer';

--Make and model sport models returned
SELECT i.inv_make, i.inv_model, c.classification_id
FROM public.inventory i 
INNER JOIN public.classification c ON i.classification_id = c.classification_id
WHERE c.classification_name = 'Sport';

--Update image and thumbnail file paths
UPDATE public.inventory 
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
	inv_thumbnail = REPLACE(inv_thumbnail, '/images/', 'images/vehicles/');