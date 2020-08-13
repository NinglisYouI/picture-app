#ifndef _KEY_INPUT_MODULE_H_
#define _KEY_INPUT_MODULE_H_

#include <event/YiEventHandler.h>
#include <youireact/modules/EventEmitter.h>
#include <youireact/NativeModule.h>
namespace yi
{
namespace react
{
class YI_RN_MODULE(KeyInputModule, EventEmitterModule), public CYIEventHandler
{
public:
    KeyInputModule();
    virtual ~KeyInputModule();

    YI_RN_EXPORT_NAME(KeyInputModule);

protected:
    virtual bool HandleEvent(const std::shared_ptr<CYIEventDispatcher> &pDispatcher, CYIEvent *pEvent) override;
    virtual void StartObserving() override;
    virtual void StopObserving() override;

};
}
}
#endif // _KEY_INPUT_MODULE_H_
