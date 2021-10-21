<?php defined('_JEXEC') or die;

$document = JFactory::getDocument();

// Подключаем стили
$document->addStyleSheet(JURI::base() . 'modules/mod_constructor_adressestable/assets/fonts/fonts.css');
$document->addStyleSheet(JURI::base() . 'modules/mod_constructor_adressestable/assets/css/style.css');

// Подключаем скрипты
$document->addScript(JURI::base() . 'modules/mod_constructor_adressestable/assets/js/svg.js');
$document->addScript(JURI::base() . 'modules/mod_constructor_adressestable/assets/js/main.js');

// Подключаем макет модуля default (default.php)
require JModuleHelper::getLayoutPath('mod_constructor_adressestable', $params->get('layout', 'default'));

?>