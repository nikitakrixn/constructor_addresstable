<?php defined('_JEXEC') or die; 

class ModConstructorAdressestableHelper 
{
    public static function getAjax() 
    {
        jimport('joomla.application.module.helper');
		$input = JFactory::getApplication()->input;
        $params = ModConstructorAdressestableHelper::getParams();

		$name = $input->getString('name', '');
        $phone = $input->getString('phone', '');
        $address = $input->getString('address', '');
        $material = $input->getString('material', '');
        $quantity = $input->getString('quantity', '');
        $color_text = $input->getString('color_text', '');
        $lamination = $input->getString('lamination', '');
        $color_table = $input->getString('color_table', '');
        $price = $input->getString('price', '');
        $mailto = $params->get('feedback-email');
        $subject = $params->get('feedback_title');

        $mailer = JFactory::getMailer();
        $config = JFactory::getConfig();

        $sender = array($config->get( 'mailfrom' ), $config->get( 'fromname' ));
        $mail = '
        <p>Сообщение от: <b>'.$name.'</b> 
        <br> Телефон: <b>'.$phone.'</b>
        <br> Адрес: <b>'.$address.'</b>
        <br> Материал: <b>'.$material.'</b>
        <br> Количество: <b>'.$quantity.'</b>
        <br> Цвет текста: <b>'.$color_text.'</b>
        <br> Ламинация: <b>'.$lamination.'</b>
        <br> Цвет таблички: <b>'.$color_table.'</b>
        <br> Цена: <b>'.$price.'</b></p>';
        
        $mailer->setSender($sender);
        $mailer->addRecipient($mailto);
        $mailer->setSubject($subject);
        $mailer->isHTML(true);
        $mailer->Encoding = 'base64';
        $mailer->setBody($mail);
        $send = $mailer->Send();

        if($send) {
        	return json_encode(array('ok'));
        } else {
        	return json_encode(array('error'));
        }
    }

    public static function getParams()
	{
		jimport('joomla.application.module.helper');
        $module = JModuleHelper::getModule('mod_constructor_adressestable');
        $moduleParams = new JRegistry;
        $moduleParams->loadString($module->params);
		return $moduleParams;		
	}
}