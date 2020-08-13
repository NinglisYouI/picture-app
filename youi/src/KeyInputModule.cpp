#include "KeyInputModule.h"

#include <framework/YiApp.h>
#include <framework/YiAppContext.h>
#include <scenetree/YiSceneManager.h>
#include <youireact/NativeModuleRegistry.h>

#define TAG "KeyInputModule"

using namespace yi::react;

YI_RN_REGISTER_MODULE(KeyInputModule);

YI_RN_INSTANTIATE_MODULE(KeyInputModule, EventEmitterModule);

static const std::string KEY_INPUT_EVENT = "KEY_INPUT";

KeyInputModule::KeyInputModule()
{
    SetSupportedEvents({
        KEY_INPUT_EVENT
    });
}

KeyInputModule::~KeyInputModule()
{
    StopObserving();
}

void KeyInputModule::StartObserving()
{
    CYISceneManager *pSceneManager = CYIAppContext::GetInstance()->GetApp()->GetSceneManager();
    pSceneManager->AddGlobalEventListener(CYIEvent::Type::KeyUp, this);
}

void KeyInputModule::StopObserving()
{
    CYISceneManager *pSceneManager = CYIAppContext::GetInstance()->GetApp()->GetSceneManager();
    pSceneManager->RemoveGlobalEventListener(CYIEvent::Type::KeyUp, this);
}

bool KeyInputModule::HandleEvent(const std::shared_ptr<CYIEventDispatcher> &pDispatcher, CYIEvent *pEvent)
{
    YI_LOGD(TAG, "HandleEvent");
    if (pEvent->IsKeyEvent())
    {
        CYIKeyEvent *pKeyEvent = (CYIKeyEvent*)pEvent;
        if (pKeyEvent->m_keyCode != CYIKeyEvent::KeyCode::Escape 
            && pKeyEvent->m_keyCode != CYIKeyEvent::KeyCode::SystemBack)
        {
            YI_LOGD(TAG, "Emitting");

            folly::dynamic result = folly::dynamic::object;
    
            result["eventName"] = KEY_INPUT_EVENT;
            
            EmitEvent(KEY_INPUT_EVENT, result);

            return true;
        }
    }
    return false;
}

