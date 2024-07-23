import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                translation: {
                    "welcome": "Welcome to React and react-i18next",
                    "new_comment": "New comment on your post",
                    "new_follower": "You have a new follower",
                    "new_message": "New message from {{name}}",
                    "report_ready": "Your report is ready",
                    "search_placeholder": "Search...",
                    "validate": "Validate",
                    "home": "Home",
                    "login": "Login",
                    "editor": "Editor",
                    "pipeline": "Pipeline",
                    "chat": "Chat",
                    "edit_profile": "Edit Profile",
                    "programmes": "Programs",
                    "sign_out": "Sign Out",
                    "create_group": "Create Group",
                    "friends_list": "Friends List",


                    "login_title": "Log in to your account",
                    "username_label": "Username",
                    "username_placeholder": "Enter your username",
                    "password_label": "Password",
                    "password_placeholder": "Enter your password",
                    "forgot_password": "Forgot password?",
                    "login_button": "Log In",
                    "no_account": "No account?",
                    "sign_up": "Sign Up",
                    "login_with_google": "Log in with Google",
                    "login_failed": "Login Failed",
                    "error_incorrect_credentials": "Incorrect username or password",
                    "error_creating_user": "Error creating user: ",
                    "error_google_login": "Error logging in with Google: ",

                    "error_fetching_actions": "Error fetching actions",
                    "error_fetching_friends": "Error fetching friends",
                    "error_fetching_requests": "Error fetching friend requests",
                    "error_accepting_request": "Error accepting friend request",
                    "error_rejecting_request": "Error rejecting friend request",

                    "loading": "Loading...",
                    "error_fetching_users": "There was an error fetching the users!",
                    "error_sending_request": "Error sending friend request",
                    "error_declining_request": "Error declining friend request",
                    "add_friends": "Add Friends",
                    "accept": "Accept",
                    "decline": "Decline",
                    "request_sent": "Request Sent",
                    "friend": "Friend",
                    "request_rejected": "Request Rejected",
                    "add": "Add",

                    "error_fetching_groups": "There was an error fetching the groups!",
                    "error_updating_group": "Error updating group",
                    "success_delete_group": "Successfully deleted the group.",
                    "error_delete_group": "Failed to delete the group.",
                    "error_deleting_group": "Error deleting group.",
                    "error_deleting_group_retry": "Error deleting group. Please try again later.",
                    "error_adding_user_to_group": "Error adding user to group",
                    "group_list": "Group List",
                    "edit": "Edit",
                    "delete": "Delete",
                    "add_user": "Add User",
                    "edit_group": "Edit Group",
                    "group_name": "Group Name",
                    "group_description": "Group Description",
                    "cancel": "Cancel",
                    "add_user_to_group": "Add User to Group",
                    "search_user": "Search User",



                    "error_fetching_file": "Error fetching file content",
                    "enter_file_name": "Enter file name:",
                    "program_deployed_success": "Program successfully deployed!",
                    "error_deploying_program": "Error deploying program",
                    "program_deploy_error": "Error deploying program.",
                    "select_file_before_run": "Please select a file before executing.",
                    "program_executed_success": "Program executed successfully!",
                    "error_executing_program": "Error executing program",
                    "program_execute_error": "Error executing program",
                    "run": "Run",
                    "deploy": "Deploy",
                    "export": "Export",
                    "select_file": "Select file",
                    "download_file": "Download File",
                    "exit_fullscreen": "Exit Fullscreen",
                    "enter_fullscreen": "Enter Fullscreen",
                    "result": "Result",
                    "deploy_program": "Deploy Program",
                    "title": "Title",
                    "description": "Description",
                    "input_file_type": "Input File Type",
                    "output_file_type": "Output File Type",
                    "confirm": "Confirm",

                    "error_fetching_programs": "Error fetching programs",
                    "search_programs": "Search programs",
                    "search": "Search",

                    "error_fetching_comments": "Error fetching comments",
                    "error_fetching_author": "Error fetching author information",
                    "error_adding_comment": "Error adding comment",
                    "error_updating_comment": "Error updating comment",
                    "error_deleting_comment": "Error deleting comment",
                    "error_deleting_action": "Error deleting action",
                    "error_creating_action": "Error creating action",
                    "error_deleting_program": "Error deleting program",
                    "error_updating_program": "Error updating program",
                    "replied_to": "Replied to",
                    "comment": "Comment...",

                    "error_fetching_group": "Error fetching group",

                    "delete_group": "Delete Group",

                    "group_created_success": "Group created successfully!",
                    "error_creating_group": "Error creating group",
                    "add_members": "Add Members",
                    "submit": "Submit",




                    "file_error_output_mismatch": "The output of the previous program does not match the input of {{title}}",
                    "file_error_input_mismatch": "The selected file does not match the required input type ({{inputType}})",
                    "pipeline_created_title": "Pipeline Created",
                    "pipeline_created_text": "Your pipeline has been successfully created!",
                    "error_creating_pipeline": "Error creating pipeline",
                    "error_title": "Error",
                    "pipeline_error_text": "There was an error creating your pipeline. Please check the error message in the drag-and-drop area.",
                    "select_file_error": "Please select a file to upload",
                    "programs": "Programs",
                    "input": "Input",
                    "output": "Output",
                    "drag_and_drop": "Drag and drop a program here",
                    "drag_and_drop_more": "Drag and drop more programs to continue the pipeline",

                    "errorImageAlt": "Error",
                    "unauthorizedPageTitle": "401 - Unauthorized page",
                    "unauthorizedPageMessage": "Ummmm Ummmm Not so fast.",
                    "goToLogin": "Go to Login"




                }
            },
            fr: {
                translation: {
                    "welcome": "Bienvenue à React et react-i18next",
                    "new_comment": "Nouveau commentaire sur votre publication",
                    "new_follower": "Vous avez un nouveau follower",
                    "new_message": "Nouveau message de {{name}}",
                    "report_ready": "Votre rapport est prêt",
                    "search_placeholder": "Recherche...",
                    "validate": "Valider",
                    "home": "Accueil",
                    "login": "Connexion",
                    "editor": "Éditeur",
                    "pipeline": "Pipeline",
                    "chat": "Message",
                    "edit_profile": "Modifier Profil",
                    "programmes": "Programmes",
                    "sign_out": "Déconnexion",
                    "create_group": "Créer un groupe",
                    "friends_list": "Liste des amis",



                    "login_title": "Connectez-vous à votre compte",
                    "username_label": "Nom d'utilisateur",
                    "username_placeholder": "Entrez votre nom d'utilisateur",
                    "password_label": "Mot de passe",
                    "password_placeholder": "Entrez votre mot de passe",
                    "forgot_password": "Mot de passe oublié?",
                    "login_button": "Connexion",
                    "no_account": "Pas de compte?",
                    "sign_up": "S'inscrire",
                    "login_with_google": "Connexion avec Google",
                    "login_failed": "Échec de la connexion",
                    "error_incorrect_credentials": "Nom d'utilisateur ou mot de passe incorrect",
                    "error_creating_user": "Erreur lors de la création de l'utilisateur: ",
                    "error_google_login": "Erreur de connexion avec Google: ",


                    "error_fetching_actions": "Erreur lors de la récupération des actions",
                    "error_fetching_friends": "Erreur lors de la récupération des amis",
                    "error_fetching_requests": "Erreur lors de la récupération des demandes d'amis",
                    "error_accepting_request": "Erreur lors de l'acceptation de la demande d'ami",
                    "error_rejecting_request": "Erreur lors du rejet de la demande d'ami",

                    "loading": "Chargement...",
                    "error_fetching_users": "Erreur lors de la récupération des utilisateurs!",
                    "error_sending_request": "Erreur lors de l'envoi de la demande d'ami",
                    "error_declining_request": "Erreur lors du rejet de la demande d'ami",
                    "add_friends": "Ajouter des amis",
                    "accept": "Accepter",
                    "decline": "Rejeter",
                    "request_sent": "Invitation envoyée",
                    "friend": "Ami",
                    "request_rejected": "Invitation rejetée",
                    "add": "Ajouter",
                    "error_fetching_groups": "Erreur lors de la récupération des groupes!",
                    "error_updating_group": "Erreur lors de la mise à jour du groupe",
                    "success_delete_group": "Groupe supprimé avec succès.",
                    "error_delete_group": "Échec de la suppression du groupe.",
                    "error_deleting_group": "Erreur lors de la suppression du groupe.",
                    "error_deleting_group_retry": "Erreur lors de la suppression du groupe. Veuillez réessayer plus tard.",
                    "error_adding_user_to_group": "Erreur lors de l'ajout de l'utilisateur au groupe",
                    "group_list": "Liste des groupes",
                    "edit": "Modifier",
                    "delete": "Supprimer",
                    "add_user": "Ajouter un utilisateur",
                    "edit_group": "Modifier le groupe",
                    "group_name": "Nom du groupe",
                    "group_description": "Description du groupe",
                    "cancel": "Annuler",
                    "add_user_to_group": "Ajouter un utilisateur au groupe",
                    "search_user": "Rechercher un utilisateur",


                    "error_fetching_file": "Erreur lors de la récupération du contenu du fichier",
                    "enter_file_name": "Entrez le nom du fichier:",
                    "program_deployed_success": "Programme déployé avec succès!",
                    "error_deploying_program": "Erreur lors du déploiement du programme",
                    "program_deploy_error": "Erreur lors du déploiement du programme.",
                    "select_file_before_run": "Veuillez sélectionner un fichier avant d'exécuter.",
                    "program_executed_success": "Programme exécuté avec succès!",
                    "error_executing_program": "Erreur lors de l'exécution du programme",
                    "program_execute_error": "Erreur lors de l'exécution du programme",
                    "run": "Exécuter",
                    "deploy": "Déployer",
                    "export": "Exporter",
                    "select_file": "Sélectionner un fichier",
                    "download_file": "Télécharger le fichier",
                    "exit_fullscreen": "Quitter le plein écran",
                    "enter_fullscreen": "Entrer en plein écran",
                    "result": "Résultat",
                    "deploy_program": "Déployer le programme",
                    "title": "Titre",
                    "description": "Description",
                    "input_file_type": "Type de fichier d'entrée",
                    "output_file_type": "Type de fichier de sortie",
                    "confirm": "Confirmer",

                    "error_fetching_programs": "Erreur lors de la récupération des programmes",
                    "search_programs": "Rechercher des programmes",
                    "search": "Rechercher",

                    "error_fetching_comments": "Erreur lors de la récupération des commentaires",
                    "error_fetching_author": "Erreur lors de la récupération des informations sur l'auteur",
                    "error_adding_comment": "Erreur lors de l'ajout du commentaire",
                    "error_updating_comment": "Erreur lors de la mise à jour du commentaire",
                    "error_deleting_comment": "Erreur lors de la suppression du commentaire",
                    "error_deleting_action": "Erreur lors de la suppression de l'action",
                    "error_creating_action": "Erreur lors de la création de l'action",
                    "error_deleting_program": "Erreur lors de la suppression du programme",
                    "error_updating_program": "Erreur lors de la mise à jour du programme",
                    "replied_to": "Répondu à",
                    "comment": "Commentaire...",

                    "error_fetching_group": "Erreur lors de la récupération du groupe",

                    "delete_group": "Supprimer le groupe",

                    "group_created_success": "Groupe créé avec succès !",
                    "error_creating_group": "Erreur lors de la création du groupe",

                    "add_members": "Ajouter des Membres",


                    "file_error_output_mismatch": "La sortie du programme précédent ne correspond pas à l'entrée de {{title}}",
                    "file_error_input_mismatch": "Le fichier sélectionné ne correspond pas au type d'entrée requis ({{inputType}})",
                    "pipeline_created_title": "Pipeline Créé",
                    "pipeline_created_text": "Votre pipeline a été créé avec succès !",
                    "error_creating_pipeline": "Erreur lors de la création du pipeline",
                    "error_title": "Erreur",
                    "pipeline_error_text": "Une erreur est survenue lors de la création de votre pipeline. Veuillez vérifier le message d'erreur dans la zone de glisser-déposer.",
                    "select_file_error": "Veuillez sélectionner un fichier à télécharger",
                    "programs": "Programmes",
                    "input": "Entrée",
                    "output": "Sortie",
                    "drag_and_drop": "Glissez et déposez un programme ici",
                    "drag_and_drop_more": "Glissez et déposez plus de programmes pour continuer le pipeline",
                    "submit": "Valider",


                    "errorImageAlt": "Erreur",
                    "unauthorizedPageTitle": "401 - Page non autorisée",
                    "unauthorizedPageMessage": "Hum hum, pas si vite.",
                    "goToLogin": "Aller à la page de connexion"

                }
            }
        },
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
