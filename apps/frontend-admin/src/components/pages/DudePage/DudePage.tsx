import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { RadioGroup, RadioGroupItem } from '../../ui/radio-group';
import { useForm } from 'react-hook-form';
import { Form, FormField } from '../../ui/form';

type ShowOn = 'show-on-message' | 'show-on-connect';
type HideOn = 'hide-on-message' | 'hide-on-disconnect';

type FormInput = {
  showOn: ShowOn;
  showOnAfter: number;
  hideOn: HideOn;
  hideOnAfter: number;
};

export function DudePage() {
  const form = useForm<FormInput>({
    defaultValues: {
      showOn: 'show-on-message',
      showOnAfter: 0,
      hideOn: 'hide-on-message',
      hideOnAfter: 10,
    },
  });

  const values = form.getValues();

  const [isShowMinutesVisible, setIsShowMinutesVisible] = useState(
    values.showOn === 'show-on-connect'
  );

  console.log('render');

  const handleSubmit = form.handleSubmit(
    (data) => {
      console.log('valid');
      console.log(data);
    },
    (error) => {
      console.log('invalid');
      console.log(error);
    }
  );

  useEffect(() => {
    form.watch((data) => {
      const showOn = data.showOn;
      if (showOn) {
        setIsShowMinutesVisible(showOn === 'show-on-connect');
      }

      handleSubmit();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dude Show/Hide</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <div>Show dude</div>
          <FormField
            control={form.control}
            name={'showOn'}
            render={({ field }) => {
              return (
                <RadioGroup
                  onValueChange={(value) => {
                    field.onChange(value);
                  }}
                  {...field}
                  className="mt-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="show-on-message"
                      id="show-on-message"
                    />
                    <Label htmlFor="show-on-message">On send message</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="show-on-connect"
                      id="show-on-connect"
                    />
                    <Label htmlFor="show-on-connect">On connect</Label>
                  </div>
                </RadioGroup>
              );
            }}
          ></FormField>

          {isShowMinutesVisible && (
            <div className="mt-4">
              <FormField
                control={form.control}
                name={'showOnAfter'}
                render={({ field }) => (
                  <>
                    <Label htmlFor="show-minutes">
                      After how many minutes?
                    </Label>
                    <Input
                      id="show-minutes"
                      placeholder="Minutes"
                      className="mt-2"
                      size={5}
                      type="number"
                      min={0}
                      {...field}
                    ></Input>
                  </>
                )}
              ></FormField>
            </div>
          )}

          <div className="mt-6">Hide dude</div>
          <FormField
            control={form.control}
            name="hideOn"
            render={({ field }) => (
              <RadioGroup
                onValueChange={(value) => {
                  field.onChange(value);
                }}
                className="mt-4"
                {...field}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="hide-on-message"
                    id="hide-on-message"
                  />
                  <Label htmlFor="hide-on-message">
                    On message timeout
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="hide-on-disconnect" id="hide-on-disconnect" />
                  <Label htmlFor="hide-on-disconnect">On disconnect</Label>
                </div>
              </RadioGroup>
            )}
          ></FormField>

          <div className="mt-4">
            <FormField
              control={form.control}
              name="hideOnAfter"
              render={({ field }) => (
                <>
                  <Label htmlFor="hide-minutes">After how many minutes?</Label>
                  <Input
                    id="hide-minutes"
                    placeholder="Minutes"
                    className="mt-2"
                    size={5}
                    type="number"
                    min={0}
                    {...field}
                  ></Input>
                </>
              )}
            ></FormField>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
}
