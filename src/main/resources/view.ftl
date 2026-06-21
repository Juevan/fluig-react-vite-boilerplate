<script>
    if (typeof WCMAPI !== 'undefined' && !WCMAPI.isMobileAppMode) {
        WCMAPI.isMobileAppMode = function() { return false; };
    }
</script>

<#-- Apenas carrega o titulo base como exemplo de i18n pro React -->
<#assign translationsJson = '{
    "widget.title": "${i18n.getTranslation(\"widget.title\")}"
}'?html>

<div id="AppWidget_${instanceId}" class="super-widget wcm-widget-class fluig-style-guide" data-params="AppWidget.instance({mode: 'view'})">
    <div id="app-root-${instanceId}" data-configs="${(widgetSettings!'{}')?html}" data-translations="${translationsJson}"></div>
</div>
