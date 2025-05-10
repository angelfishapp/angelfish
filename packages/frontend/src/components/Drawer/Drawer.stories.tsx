import { action } from '@storybook/addon-actions'
import type { Meta, StoryObj } from '@storybook/react'

import Drawer from './Drawer'

const meta = {
  title: 'Components/Drawer',
  component: Drawer,
  args: {
    onClose: (reason) => action('onClose Clicked')(reason),
    children: undefined,
  },
  render: ({ ...args }) => {
    const RenderComponent = () => {
      const { ...props } = args
      return (
        <Drawer {...props}>
          <div>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse
            lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum
            ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin
            porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit
            amet erat. Duis semper. Duis arcu massa, scelerisque vitae, consequat in, pretium a,
            enim. Pellentesque congue. Ut in risus volutpat libero pharetra tempor. Cras vestibulum
            bibendum augue. Praesent egestas leo in pede. Praesent blandit odio eu enim.
            Pellentesque sed dui ut augue blandit sodales. Vestibulum ante ipsum primis in faucibus
            orci luctus et ultrices posuere cubilia Curae; Aliquam nibh. Mauris ac mauris sed pede
            pellentesque fermentum. Maecenas adipiscing ante non diam sodales hendrerit. Lorem ipsum
            dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor,
            dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam.
            Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci
            nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat. Duis
            semper. Duis arcu massa, scelerisque vitae, consequat in, pretium a, enim. Pellentesque
            congue. Ut in risus volutpat libero pharetra tempor. Cras vestibulum bibendum augue.
            Praesent egestas leo in pede. Praesent blandit odio eu enim. Pellentesque sed dui ut
            augue blandit sodales. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices
            posuere cubilia Curae; Aliquam nibh. Mauris ac mauris sed pede pellentesque fermentum.
            Maecenas adipiscing ante non diam sodales hendrerit. Lorem ipsum dolor sit amet,
            consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit
            amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas
            ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec
            nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat. Duis
            semper. Duis arcu massa, scelerisque vitae, consequat in, pretium a, enim. Pellentesque
            congue. Ut in risus volutpat libero pharetra tempor. Cras vestibulum bibendum augue.
            Praesent egestas leo in pede. Praesent blandit odio eu enim. Pellentesque sed dui ut
            augue blandit sodales. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices
            posuere cubilia Curae; Aliquam nibh. Mauris ac mauris sed pede pellentesque fermentum.
            Maecenas adipiscing ante non diam sodales hendrerit. Lorem ipsum dolor sit amet,
            consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit
            amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas
            ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec
            nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat. Duis
            semper. Duis arcu massa, scelerisque vitae, consequat in, pretium a, enim. Pellentesque
            congue. Ut in risus volutpat libero pharetra tempor. Cras vestibulum bibendum augue.
            Praesent egestas leo in pede. Praesent blandit odio eu enim. Pellentesque sed dui ut
            augue blandit sodales. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices
            posuere cubilia Curae; Aliquam nibh. Mauris ac mauris sed pede pellentesque fermentum.
            Maecenas adipiscing ante non diam sodales hendrerit. Lorem ipsum dolor sit amet,
            consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit
            amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas
            ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec
            nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat. Duis
            semper. Duis arcu massa, scelerisque vitae, consequat in, pretium a, enim. Pellentesque
            congue. Ut in risus volutpat libero pharetra tempor. Cras vestibulum bibendum augue.
            Praesent egestas leo in pede. Praesent blandit odio eu enim. Pellentesque sed dui ut
            augue blandit sodales. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices
            posuere cubilia Curae; Aliquam nibh. Mauris ac mauris sed pede pellentesque fermentum.
            Maecenas adipiscing ante non diam sodales hendrerit. Lorem ipsum dolor sit amet,
            consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit
            amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas
            ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec
            nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat. Duis
            semper. Duis arcu massa, scelerisque vitae, consequat in, pretium a, enim. Pellentesque
            congue. Ut in risus volutpat libero pharetra tempor. Cras vestibulum bibendum augue.
            Praesent egestas leo in pede. Praesent blandit odio eu enim. Pellentesque sed dui ut
            augue blandit sodales. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices
            posuere cubilia Curae; Aliquam nibh. Mauris ac mauris sed pede pellentesque fermentum.
            Maecenas adipiscing ante non diam sodales hendrerit. Lorem ipsum dolor sit amet,
            consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit
            amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas
            ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec
            nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat. Duis
            semper. Duis arcu massa, scelerisque vitae, consequat in, pretium a, enim. Pellentesque
            congue. Ut in risus volutpat libero pharetra tempor. Cras vestibulum bibendum augue.
            Praesent egestas leo in pede. Praesent blandit odio eu enim. Pellentesque sed dui ut
            augue blandit sodales. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices
            posuere cubilia Curae; Aliquam nibh. Mauris ac mauris sed pede pellentesque fermentum.
            Maecenas adipiscing ante non diam sodales hendrerit. Lorem ipsum dolor sit amet,
            consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit
            amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas
            ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec
            nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat. Duis
            semper. Duis arcu massa, scelerisque vitae, consequat in, pretium a, enim. Pellentesque
            congue. Ut in risus volutpat libero pharetra tempor. Cras vestibulum bibendum augue.
            Praesent egestas leo in pede. Praesent blandit odio eu enim. Pellentesque sed dui ut
            augue blandit sodales. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices
            posuere cubilia Curae; Aliquam nibh. Mauris ac mauris sed pede pellentesque fermentum.
            Maecenas adipiscing ante non diam sodales hendrerit.
          </div>
        </Drawer>
      )
    }
    return <RenderComponent />
  },
} satisfies Meta<typeof Drawer>
export default meta
type Story = StoryObj<typeof meta>

/**
 * Stories
 */

export const Right: Story = {
  args: {
    open: true,
    disableBackdropClose: false,
    title: 'Edit Drawer',
    onSave: undefined,
    menuItems: [
      {
        label: 'Delete Item',
        color: 'red',
        onClick: () => action('Delete Clicked')(),
      },
    ],
  },
}

export const RightWithSaveButton: Story = {
  args: {
    open: true,
    disableBackdropClose: false,
    title: 'Edit Drawer',
    onSave: action('onSave Clicked'),
    menuItems: [
      {
        label: 'Delete Item',
        onClick: () => action('Delete Clicked')(),
      },
    ],
  },
}

export const Bottom: Story = {
  args: {
    open: true,
    disableBackdropClose: false,
    title: 'Edit Drawer',
    position: 'bottom',
    menuItems: [
      {
        label: 'Delete Item',
        onClick: () => action('Delete Clicked')(),
      },
    ],
  },
}
